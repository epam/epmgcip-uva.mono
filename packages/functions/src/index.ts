import express from "express";
import * as functions from "firebase-functions";
import {checkAuthToken} from "./middlewares/check-auth-token";
import authRouter from "./resources/auth/auth.router";
import userRouter from "./resources/user/user.router";
import * as admin from "firebase-admin";
import {Change, onDocumentCreated,
  onDocumentUpdated,
  QueryDocumentSnapshot} from "firebase-functions/v2/firestore";
import {updatePublishedEvent}
  from "./resources/bot/actions/updatePublishedEvent";
import {sendToChannel} from "./resources/bot/actions/sendToChannel";
import {deleteTelegramMessage}
  from "./resources/bot/actions/deleteTelegramMessage";
import {logger} from "firebase-functions";

admin.initializeApp();

export const scheduledEventStatusUpdate = functions.pubsub
  .schedule("every 240 hours")
  .onRun(async () => {
    const now = new Date();

    try {
      const snapshot = await admin.firestore()
        .collection("events")
        .where("status", "==", "active")
        .get();

      if (snapshot.empty) {
        logger.error("No active events to update.");
        return null;
      }

      const batch = admin.firestore().batch();
      snapshot.forEach((doc) => {
        const eventData = doc.data();
        const eventEndDate = new Date(eventData.endDate);

        if (eventEndDate <= now) {
          batch.update(doc.ref, {status: "completedEvent"});
        }
      });

      await batch.commit();
      logger.info("Active events statuses updated to \"completedEvent\".");
    } catch (error) {
      logger.error("Error updating event statuses:", error);
    }

    return null;
  });

export const publishToTelegram =
onDocumentCreated("events/{eventId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No data associated with the event");
    return;
  }
  try {
    const data = snapshot.data();
    await sendToChannel(data);
  } catch (err) {
    logger.error("Unable to send post to channel", err);
  }
});


export const deleteEventFromTelegram =
 onDocumentUpdated("events/{eventId}", async (event) => {
   const beforeData = event.data?.before.data();
   const afterData = event.data?.after.data();

   if (beforeData && afterData) {
     if (beforeData.status !== "canceled" && afterData.status === "canceled") {
       await deleteTelegramMessage(afterData);
     }
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
