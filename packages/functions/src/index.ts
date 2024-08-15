import express from "express";
import * as functions from "firebase-functions";
import {checkAuthToken} from "./middlewares/check-auth-token";
import authRouter from "./resources/auth/auth.router";
import userRouter from "./resources/user/user.router";

const app = express();
app.use("/auth", authRouter);
app.use("/user", checkAuthToken, userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});



exports.api = functions.https.onRequest(app);
