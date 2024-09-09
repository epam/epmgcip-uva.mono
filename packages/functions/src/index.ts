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
import TelegramBot from "node-telegram-bot-api";

admin.initializeApp();

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

 const token = '7209672276:AAF5sHwJeGmYbCd08xZR1amlcGYBD1edqVw';
 const bot = new TelegramBot(token, { polling: true });
 const registrationUrl = 'https://core.telegram.org/bots/webapps';

 bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the FridayAuraBot!\nHow can I assist you?\nPossible use cases:\n\/todo: for appending to a todolist\n\/idea: for random ideas\n\/thoughts: for deep thoughts\n\/blog: for adding blog titles\n\/showtodo: to show todolist\n\/done: to remove item from todolist\n\/showtitles to show all blog titles');
});
 
 bot.on('message', async (msg) => {
     const chatId = msg.chat.id;
     const text = msg.text;
 
     if (text === '/register') {
         await bot.sendMessage(chatId, "Click the button below to register:", {
             reply_markup: {
                 inline_keyboard: [
                     [
                         {
                             text: 'Register',
                             web_app: { url: registrationUrl }
                         }
                     ]
                 ]
             }
         });
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
