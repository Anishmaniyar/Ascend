// Dummy data for the authenticated app (dashboard + nav pages).
// Replace with API calls later — shapes mirror the backend responses.

export const user = {
  name: "Anish",
  displayName: "Anish Maniyar",
  email: "anish@student.in",
  userId: "anish_2026",
  initials: "AM",
  avatar: null, // null = show initials fallback
  bio: "Final year CSE · targeting TCS & Infosys",
  memberSince: "Jan 2026",
  streak: 7,
  location: "Mumbai, India",
  xId: "",
  github: "",
  linkedin: "",
  leetcode: "",
  website: "",
};

// Skills derived from user's practice/attempt data.
// Each skill = a subtopic the user has solved questions from.
// solved = number of questions solved from that subtopic.
export const profileSkills = [
  // Advanced
  { name: "Permutations & Combinations", solved: 14, level: "advanced" },
  { name: "Probability", solved: 8, level: "advanced" },
  { name: "Trigonometry", solved: 6, level: "advanced" },
  { name: "Mensuration", solved: 5, level: "advanced" },
  { name: "Coordinate Geometry", solved: 3, level: "advanced" },
  // Intermediate
  { name: "Profit & Loss", solved: 31, level: "intermediate" },
  { name: "Time & Work", solved: 23, level: "intermediate" },
  { name: "Time & Distance", solved: 21, level: "intermediate" },
  { name: "Simple & Compound Interest", solved: 18, level: "intermediate" },
  { name: "Number System", solved: 12, level: "intermediate" },
  // Fundamental
  { name: "Percentages", solved: 99, level: "fundamental" },
  { name: "Ratio & Proportion", solved: 33, level: "fundamental" },
  { name: "Averages", solved: 21, level: "fundamental" },
  { name: "Mixtures & Alligations", solved: 19, level: "fundamental" },
  { name: "HCF & LCM", solved: 15, level: "fundamental" },
];

export const quickStats = [
  { id: "solved", label: "Questions Solved", value: 324, suffix: "", icon: "trend" },
  { id: "accuracy", label: "Overall Accuracy", value: 81, suffix: "%", icon: "target" },
  { id: "streak", label: "Current Streak", value: 7, suffix: " Days", icon: "flame" },
  { id: "sessions", label: "Practice Sessions", value: 28, suffix: "", icon: "clock" },
];

export const continueSession = {
  topic: "Quantitative Aptitude",
  subtopic: "Profit & Loss",
  done: 12,
  total: 20,
  mode: "Practice",
  accuracy: 80,
};

export const dailyGoal = {
  label: "Today's Goal",
  target: 20,
  done: 12,
  unit: "Questions",
};

export const skills = [
  { topic: "Quantitative", accuracy: 82, solved: 145 },
  { topic: "Logical", accuracy: 74, solved: 63 },
  { topic: "Verbal", accuracy: 60, solved: 42 },
];

export const companySheets = [
  { id: "tcs", name: "TCS", initial: "T", difficulty: "MEDIUM", questions: 150 },
  { id: "infosys", name: "Infosys", initial: "I", difficulty: "MEDIUM", questions: 120 },
  { id: "accenture", name: "Accenture", initial: "A", difficulty: "HARD", questions: 90 },
];

export const practiceHistory = [
  {
    id: "h1",
    subtopic: "Profit & Loss",
    topic: "Quantitative Aptitude",
    score: 15,
    total: 18,
    accuracy: 83,
    when: "Yesterday",
    mode: "Practice",
  },
  {
    id: "h2",
    subtopic: "Time & Work",
    topic: "Quantitative Aptitude",
    score: 11,
    total: 12,
    accuracy: 92,
    when: "2 days ago",
    mode: "Test",
  },
  {
    id: "h3",
    subtopic: "Number System",
    topic: "Quantitative Aptitude",
    score: 15,
    total: 20,
    accuracy: 75,
    when: "Last week",
    mode: "Practice",
  },
  {
    id: "h4",
    subtopic: "Probability",
    topic: "Quantitative Aptitude",
    score: 9,
    total: 15,
    accuracy: 60,
    when: "Last week",
    mode: "Test",
  },
];

export const recentDiscussions = [
  {
    id: "d1",
    title: "How to solve Probability faster?",
    snippet: "I keep spending 3+ minutes on probability questions in tests…",
    tag: "Probability",
    replies: 12,
    likes: 34,
    time: "2h ago",
  },
  {
    id: "d2",
    title: "Best resources for Logical Reasoning?",
    snippet: "Anyone found a structured way to practice syllogisms and puzzles…",
    tag: "Reasoning",
    replies: 8,
    likes: 21,
    time: "5h ago",
  },
  {
    id: "d3",
    title: "Time & Work shortcuts that actually work",
    snippet: "Sharing the LCM method I use — cuts most Time & Work problems…",
    tag: "Quant",
    replies: 19,
    likes: 47,
    time: "1d ago",
  },
];

export const recommendedTopics = [
  { id: "r1", topic: "Probability", accuracy: 52, solved: 15, reason: "Lowest accuracy" },
  { id: "r2", topic: "Syllogisms", accuracy: 58, solved: 9, reason: "Needs practice" },
];

// Deterministic GitHub-style heatmap (seeded, so builds are stable).
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildHeatmap(cols = 26) {
  const rand = mulberry32(42);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weeks = [];
  for (let w = cols - 1; w >= 0; w--) {
    const date = new Date(today);
    date.setDate(today.getDate() - (w * 7 + 6)); // Monday of that week
    const days = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(date);
      day.setDate(date.getDate() + d);
      if (day > today) {
        days.push(0);
        continue;
      }
      const r = rand();
      days.push(r > 0.62 ? 0 : r > 0.42 ? 1 : r > 0.26 ? 2 : r > 0.12 ? 3 : 4);
    }
    weeks.push({ date, days });
  }
  return weeks;
}
