import prisma from "../../db.js";

const select = {
  id: true,
  title: true,
  description: true,
  type: true,
  company: true,
  difficulty: true,
  startsAt: true,
  endsAt: true,
  durationMin: true,
  totalQuestions: true,
  _count: { select: { registrations: true } },
};

export const findContests = async () => {
  return await prisma.contest.findMany({
    select,
    orderBy: { startsAt: "asc" },
  });
};

export const findContestById = async (contestId) => {
  return await prisma.contest.findUnique({
    where: { id: contestId },
    select,
  });
};

export const findUserRegistrations = async (userId) => {
  const rows = await prisma.contestRegistration.findMany({
    where: { userId },
    select: { contestId: true },
  });
  return new Set(rows.map((r) => r.contestId));
};

export const findRegistration = async (contestId, userId) => {
  return await prisma.contestRegistration.findUnique({
    where: { contestId_userId: { contestId, userId } },
  });
};

export const createRegistration = async (contestId, userId) => {
  return await prisma.contestRegistration.create({
    data: { contestId, userId },
  });
};

export const deleteRegistration = async (contestId, userId) => {
  return await prisma.contestRegistration.delete({
    where: { contestId_userId: { contestId, userId } },
  });
};

export const createContest = async (data) => {
  return await prisma.contest.create({ data });
};

export const updateContest = async (contestId, data) => {
  return await prisma.contest.update({ where: { id: contestId }, data });
};

export const deleteContest = async (contestId) => {
  return await prisma.contest.delete({ where: { id: contestId } });
};
