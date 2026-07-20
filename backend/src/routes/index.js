import express from "express";

import authRouter from "../modules/auth/auth.routes.js";
import topicRouter from "../modules/topics/topic.routes.js";
import questionRouter from "../modules/questions/question.routes.js";
import practiceSessionRouter from "../modules/practiceSession/practice-session.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Server infrastructure functional" });
});

router.use("/auth", authRouter);
router.use("/topic", topicRouter);
router.use("/question", questionRouter);
router.use("/practice-session", practiceSessionRouter);

export default router;
