import express from "express";
import * as functions from "firebase-functions";
import {checkAuthToken} from "./middlewares/check-auth-token";
import authRouter from "./resources/auth/auth.router";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/auth", authRouter);

app.get("/protected", checkAuthToken, (req, res) =>
  res.status(200).json({
    status: "protected endpoint",
  })
);

exports.api = functions.https.onRequest(app);
