import express from "express";
import * as functions from "firebase-functions";
import {checkAuthToken} from "./middlewares/check-auth-token";
import authRouter from "./resources/auth/auth.router";
import userRouter from "./resources/user/user.router";
import * as admin from "firebase-admin";
import {Change, onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
  QueryDocumentSnapshot} from "firebase-functions/v2/firestore";
import {updatePublishedEvent}
  from "./resources/bot/actions/updatePublishedEvent";
import {sendToChannel} from "./resources/bot/actions/sendToChannel";
import {deleteTelegramMessage}
  from "./resources/bot/actions/deleteTelegramMessage";

admin.initializeApp();

export const publishToTelegram =
onDocumentCreated("events/{eventId}", (event) => {
  const snapshot = event.data;
  if (snapshot) {
    const data = snapshot.data();
    sendToChannel(data);
  }
});


export const deleteEventFromTelegram =
 onDocumentDeleted("events/{eventId}", (event) => {
   const snapshot = event.data;
   if (snapshot) {
     const data = snapshot.data();
     deleteTelegramMessage(data);
   }
 });

export const updatePublishedEventTrigger =
 onDocumentUpdated("events/{eventId}", (event) => {
   const change = event.data as Change<QueryDocumentSnapshot>;

   const beforeData = change.before.data() as admin.firestore.DocumentData;
   const afterData = change.after.data() as admin.firestore.DocumentData;

   if (JSON.stringify(beforeData) !== JSON.stringify(afterData)) {
     updatePublishedEvent(afterData);
   }
 });


const app = express();

app.use("/auth", authRouter);
app.use("/user", checkAuthToken, userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

exports.api = functions.https.onRequest(app);
