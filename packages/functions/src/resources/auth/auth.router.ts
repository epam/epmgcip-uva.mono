import {Router} from "express";

const router = Router();

router.post("/", (req, res) =>
  res.status(200).json({
    status: "auth endpoint",
  })
);

export default router;
