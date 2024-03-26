import express from "express";

const router = express.Router();

router.post("/auth", (req, res) =>
  res.status(200).json({
    status: "auth endpoint",
  })
);

export default router;
