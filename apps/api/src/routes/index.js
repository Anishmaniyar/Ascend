import express from "express";

import authRouter from "../modules/auth/auth.routes.js";
import topicRouter from "../modules/topics/topic.routes.js";
import questionRouter from "../modules/questions/question.routes.js";
import practiceSessionRouter from "../modules/practiceSession/practice-session.routes.js";
import profileRouter from "../modules/profile/profile.routes.js";
import badgeRouter from "../modules/badges/badge.routes.js";
import leaderboardRouter from "../modules/leaderboard/leaderboard.routes.js";
import discussionRouter from "../modules/discussions/discussion.routes.js";
import {
  contestRouter,
  contestAdminRouter,
} from "../modules/contests/contest.routes.js";
import adminRouter from "../modules/admin/admin.routes.js";
import companySheets from "../modules/companySheets/companySheets.routes.js";

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
router.use("/profile", profileRouter);
router.use("/profile/badges", badgeRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/discussions", discussionRouter);
router.use("/contests", contestRouter);
router.use("/admin/contests", contestAdminRouter);
router.use("/admin", adminRouter);
router.use("/admin/sheets", companySheets);

export default router;
