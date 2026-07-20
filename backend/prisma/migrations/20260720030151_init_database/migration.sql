-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('MCQ', 'NUMERIC');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('PRACTICE', 'TEST');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "password" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatar" TEXT DEFAULT 'https://dicebear.com',
    "bio" TEXT DEFAULT 'Aptitude learner',
    "current_streak" INTEGER,
    "longest_streak" INTEGER,
    "last_solved_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subtopics" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subtopics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'EASY',
    "type" "Type" NOT NULL DEFAULT 'MCQ',
    "solution" TEXT NOT NULL,
    "subtopic_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "options" (
    "id" TEXT NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "question_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sheets" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "estimatedTime" TEXT NOT NULL DEFAULT '1:00',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sheet_questions" (
    "id" TEXT NOT NULL,
    "sheet_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sheet_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subtopic_id" TEXT NOT NULL,
    "mode" "Mode" NOT NULL DEFAULT 'PRACTICE',
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_option_id" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussions" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discussions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "discussion_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "replies" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_likes" (
    "id" TEXT NOT NULL,
    "discussion_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "subtopics_topic_id_idx" ON "subtopics"("topic_id");

-- CreateIndex
CREATE INDEX "questions_subtopic_id_idx" ON "questions"("subtopic_id");

-- CreateIndex
CREATE INDEX "options_question_id_idx" ON "options"("question_id");

-- CreateIndex
CREATE INDEX "sheet_questions_sheet_id_idx" ON "sheet_questions"("sheet_id");

-- CreateIndex
CREATE INDEX "sheet_questions_question_id_idx" ON "sheet_questions"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "sheet_questions_sheet_id_question_id_key" ON "sheet_questions"("sheet_id", "question_id");

-- CreateIndex
CREATE INDEX "practice_sessions_user_id_idx" ON "practice_sessions"("user_id");

-- CreateIndex
CREATE INDEX "practice_sessions_subtopic_id_idx" ON "practice_sessions"("subtopic_id");

-- CreateIndex
CREATE INDEX "attempts_user_id_idx" ON "attempts"("user_id");

-- CreateIndex
CREATE INDEX "attempts_session_id_idx" ON "attempts"("session_id");

-- CreateIndex
CREATE INDEX "attempts_question_id_idx" ON "attempts"("question_id");

-- CreateIndex
CREATE INDEX "discussions_user_id_idx" ON "discussions"("user_id");

-- CreateIndex
CREATE INDEX "comments_discussion_id_idx" ON "comments"("discussion_id");

-- CreateIndex
CREATE INDEX "comments_user_id_idx" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "replies_comment_id_idx" ON "replies"("comment_id");

-- CreateIndex
CREATE INDEX "replies_user_id_idx" ON "replies"("user_id");

-- CreateIndex
CREATE INDEX "discussion_likes_discussion_id_idx" ON "discussion_likes"("discussion_id");

-- CreateIndex
CREATE INDEX "discussion_likes_user_id_idx" ON "discussion_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "discussion_likes_discussion_id_user_id_key" ON "discussion_likes"("discussion_id", "user_id");

-- AddForeignKey
ALTER TABLE "subtopics" ADD CONSTRAINT "subtopics_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_subtopic_id_fkey" FOREIGN KEY ("subtopic_id") REFERENCES "subtopics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_subtopic_id_fkey" FOREIGN KEY ("subtopic_id") REFERENCES "subtopics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "practice_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_likes" ADD CONSTRAINT "discussion_likes_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_likes" ADD CONSTRAINT "discussion_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
