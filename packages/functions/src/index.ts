import express from "express";
import * as functions from "firebase-functions";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.post("/auth", (req, res) =>
  res.status(200).json({
    status: "auth endpoint",
  })
);

exports.api = functions.https.onRequest(app);
