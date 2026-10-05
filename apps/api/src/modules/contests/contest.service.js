import AppError from "../../utils/AppError.js";
import * as ContestRepository from "./contest.repository.js";

// Status derives from wall-clock time on every read — never stored.
export const contestStatus = (contest, now = new Date()) => {
  if (now < contest.startsAt) return "upcoming";
  if (now <= contest.endsAt) return "live";
  return "ended";
};

const toDTO = (contest, registered) => ({
  id: contest.id,
  title: contest.title,
  description: contest.description,
  type: contest.type,
  company: contest.company,
  difficulty: contest.difficulty,
  startsAt: contest.startsAt,
  endsAt: contest.endsAt,
  durationMin: contest.durationMin,
  totalQuestions: contest.totalQuestions,
  participants: contest._count.registrations,
  registered: registered ?? false,
  status: contestStatus(contest),
});

export const listContestsService = async (userId) => {
  const [contests, mine] = await Promise.all([
    ContestRepository.findContests(),
    ContestRepository.findUserRegistrations(userId),
  ]);
  return contests.map((c) => toDTO(c, mine.has(c.id)));
};

export const getContestService = async (contestId, userId) => {
  const contest = await ContestRepository.findContestById(contestId);
  if (!contest) {
    throw new AppError("Contest not found", 404);
  }
  const mine = await ContestRepository.findUserRegistrations(userId);
  return toDTO(contest, mine.has(contest.id));
};

export const registerService = async (contestId, userId) => {
  const contest = await ContestRepository.findContestById(contestId);
  if (!contest) {
    throw new AppError("Contest not found", 404);
  }
  if (contestStatus(contest) === "ended") {
    throw new AppError("Contest has ended", 400);
  }
  const existing = await ContestRepository.findRegistration(contestId, userId);
  if (existing) {
    throw new AppError("Already registered for this contest", 409);
  }
  await ContestRepository.createRegistration(contestId, userId);
  return { contestId, registered: true };
};

export const unregisterService = async (contestId, userId) => {
  const contest = await ContestRepository.findContestById(contestId);
  if (!contest) {
    throw new AppError("Contest not found", 404);
  }
  try {
    await ContestRepository.deleteRegistration(contestId, userId);
  } catch (error) {
    if (error?.code === "P2025") {
      throw new AppError("Registration not found", 404);
    }
    throw error;
  }
  return { contestId, registered: false };
};

export const createContestService = async (data) => {
  const contest = await ContestRepository.createContest(data);
  return toDTO({ ...contest, _count: { registrations: 0 } }, false);
};

export const updateContestService = async (contestId, data) => {
  try {
    const contest = await ContestRepository.updateContest(contestId, data);
    const full = await ContestRepository.findContestById(contest.id);
    return toDTO(full, false);
  } catch (error) {
    if (error?.code === "P2025") {
      throw new AppError("Contest not found", 404);
    }
    throw error;
  }
};

export const deleteContestService = async (contestId) => {
  try {
    await ContestRepository.deleteContest(contestId);
  } catch (error) {
    if (error?.code === "P2025") {
      throw new AppError("Contest not found", 404);
    }
    throw error;
  }
  return { id: contestId };
};
