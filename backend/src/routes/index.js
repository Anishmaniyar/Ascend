import express from "express";
import authRouter from "../modules/auth/auth.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Server infrastructure functional" });
});

router.use("/auth", authRouter);

export default router;
