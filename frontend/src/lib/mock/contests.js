// ═══════════════════════════════════════════════════════════════════════
// CONTESTS MOCK DATA
// ═══════════════════════════════════════════════════════════════════════

export const contests = [
  {
    id: "contest-1",
    title: "Weekly Quantitative Sprint",
    description:
      "Test your speed and accuracy on 20 quantitative aptitude questions. Compete with peers and climb the leaderboard.",
    type: "quantitative",
    difficulty: "Medium",
    duration: 30, // minutes
    questions: 20,
    status: "upcoming",
    startDate: "2026-08-28T18:00:00",
    endDate: "2026-08-28T18:30:00",
    participants: 0,
    maxParticipants: 500,
    prize: "Top 10 get exclusive badges",
    tags: ["Quantitative", "Speed", "Weekly"],
  },
  {
    id: "contest-2",
    title: "Logical Reasoning Challenge",
    description:
      "Solve 15 logical reasoning puzzles under time pressure. Includes syllogisms, seating arrangements, and coding-decoding.",
    type: "logical",
    difficulty: "Hard",
    duration: 45,
    questions: 15,
    status: "upcoming",
    startDate: "2026-08-30T10:00:00",
    endDate: "2026-08-30T10:45:00",
    participants: 0,
    maxParticipants: 300,
    prize: "Top 5 get premium badges",
    tags: ["Logical", "Puzzles", "Monthly"],
  },
  {
    id: "contest-3",
    title: "Verbal Ability Showdown",
    description:
      "Challenge your verbal skills with synonyms, antonyms, sentence correction, and reading comprehension.",
    type: "verbal",
    difficulty: "Easy",
    duration: 25,
    questions: 25,
    status: "live",
    startDate: "2026-08-23T14:00:00",
    endDate: "2026-08-23T14:25:00",
    participants: 142,
    maxParticipants: 400,
    prize: "Top 10 get leaderboard boost",
    tags: ["Verbal", "English", "Live"],
  },
  {
    id: "contest-4",
    title: "Data Interpretation Battle",
    description:
      "Interpret bar graphs, pie charts, and line graphs to answer 12 challenging questions.",
    type: "di",
    difficulty: "Hard",
    duration: 40,
    questions: 12,
    status: "live",
    startDate: "2026-08-23T15:00:00",
    endDate: "2026-08-23T15:40:00",
    participants: 89,
    maxParticipants: 200,
    prize: "Top 3 get exclusive DI badge",
    tags: ["DI", "Charts", "Live"],
  },
  {
    id: "contest-5",
    title: "Mixed Aptitude Gauntlet",
    description:
      "A comprehensive test covering quantitative, logical, and verbal sections. 30 questions across all topics.",
    type: "mixed",
    difficulty: "Medium",
    duration: 60,
    questions: 30,
    status: "completed",
    startDate: "2026-08-16T18:00:00",
    endDate: "2026-08-16T19:00:00",
    participants: 312,
    maxParticipants: 500,
    prize: "Top 15 get recognition badges",
    tags: ["Mixed", "All Topics", "Weekly"],
  },
  {
    id: "contest-6",
    title: "Profit & Loss Special",
    description:
      "Focus on profit, loss, and discount problems. 20 carefully curated questions for focused practice.",
    type: "quantitative",
    difficulty: "Easy",
    duration: 20,
    questions: 20,
    status: "completed",
    startDate: "2026-08-09T18:00:00",
    endDate: "2026-08-09T18:20:00",
    participants: 256,
    maxParticipants: 400,
    prize: "All participants get completion badge",
    tags: ["Quantitative", "Profit & Loss", "Beginner"],
  },
  {
    id: "contest-7",
    title: "Coding-Decoding Marathon",
    description:
      "A specialized contest for coding-decoding enthusiasts. Solve 18 questions and prove your pattern recognition skills.",
    type: "logical",
    difficulty: "Medium",
    duration: 35,
    questions: 18,
    status: "completed",
    startDate: "2026-08-02T18:00:00",
    endDate: "2026-08-02T18:35:00",
    participants: 198,
    maxParticipants: 300,
    prize: "Top 10 get special recognition",
    tags: ["Logical", "Coding-Decoding", "Special"],
  },
  {
    id: "contest-8",
    title: "Speed Math Challenge",
    description:
      "Test your mental math speed with 25 quick-fire quantitative questions. No calculator allowed!",
    type: "quantitative",
    difficulty: "Hard",
    duration: 15,
    questions: 25,
    status: "upcoming",
    startDate: "2026-09-01T18:00:00",
    endDate: "2026-09-01T18:15:00",
    participants: 0,
    maxParticipants: 300,
    prize: "Top 5 get speed demon badge",
    tags: ["Quantitative", "Speed", "Mental Math"],
  },
];

// Contest type labels and colors
export const CONTEST_TYPES = [
  { id: "all", label: "All Contests" },
  { id: "quantitative", label: "Quantitative" },
  { id: "logical", label: "Logical" },
  { id: "verbal", label: "Verbal" },
  { id: "di", label: "Data Interpretation" },
  { id: "mixed", label: "Mixed" },
];

export const CONTEST_STATUS = [
  { id: "all", label: "All Status" },
  { id: "upcoming", label: "Upcoming" },
  { id: "live", label: "Live" },
  { id: "completed", label: "Completed" },
];

export const STATUS_COLORS = {
  upcoming: "bg-brass/10 text-brass",
  live: "bg-success/10 text-success",
  completed: "bg-slate/10 text-slate",
};

export const STATUS_DOT_COLORS = {
  upcoming: "bg-brass",
  live: "bg-success",
  completed: "bg-slate",
};

export const DIFF_COLORS = {
  Easy: "bg-success/10 text-success",
  Medium: "bg-brass/10 text-brass",
  Hard: "bg-ember/10 text-ember",
};

export const DIFF_DOT_COLORS = {
  Easy: "bg-success",
  Medium: "bg-brass",
  Hard: "bg-ember",
};

// User's contest participation
export const userContests = {
  participated: ["contest-5", "contest-6", "contest-7"],
  results: {
    "contest-5": { rank: 23, score: 22, accuracy: 85, time: "52:30" },
    "contest-6": { rank: 8, score: 18, accuracy: 90, time: "18:45" },
    "contest-7": { rank: 15, score: 14, accuracy: 78, time: "32:10" },
  },
};
