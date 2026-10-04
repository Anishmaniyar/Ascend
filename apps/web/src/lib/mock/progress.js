// Mock data for the Progress Overview page.
// Replace with real API calls later.

// ── Radial Ring Metrics ───────────────────────────────────────────────
export const radialMetrics = {
  questionsSolved: { solved: 324, total: 1200 },
  accuracy: 76.4,
  practiceSessions: { completed: 38, total: 52 },
};

// ── Performance Trend (monthly) ───────────────────────────────────────
export const performanceTrendMonthly = [
  { month: "Jan", accuracy: 68, questionsSolved: 85 },
  { month: "Feb", accuracy: 71, questionsSolved: 110 },
  { month: "Mar", accuracy: 73, questionsSolved: 145 },
  { month: "Apr", accuracy: 74, questionsSolved: 170 },
  { month: "May", accuracy: 76, questionsSolved: 210 },
  { month: "Jun", accuracy: 78, questionsSolved: 250 },
  { month: "Jul", accuracy: 76, questionsSolved: 275 },
];

// ── Accuracy by Difficulty ────────────────────────────────────────────
export const difficultyAccuracy = {
  overall: 76.4,
  easy: { accuracy: 82.1, attempted: 512, total: 624 },
  medium: { accuracy: 74.3, attempted: 562, total: 756 },
  hard: { accuracy: 62.7, attempted: 171, total: 273 },
};

// ── Topic Progress ────────────────────────────────────────────────────
export const topicProgress = [
  {
    id: "quant",
    name: "Quantitative Aptitude",
    icon: "BrainIcon",
    progress: 78,
    accuracy: 77.6,
    solved: 624,
    total: 800,
  },
  {
    id: "logical",
    name: "Logical Reasoning",
    icon: "LightbulbIcon",
    progress: 64,
    accuracy: 72.1,
    solved: 312,
    total: 490,
  },
  {
    id: "di",
    name: "Data Interpretation",
    icon: "BarChart3Icon",
    progress: 71,
    accuracy: 75.3,
    solved: 201,
    total: 285,
  },
  {
    id: "verbal",
    name: "Verbal Ability",
    icon: "ChatIcon",
    progress: 58,
    accuracy: 69.8,
    solved: 108,
    total: 186,
  },
  {
    id: "ga",
    name: "General Awareness",
    icon: "GlobeIcon",
    progress: 42,
    accuracy: 65.2,
    solved: 62,
    total: 148,
  },
  {
    id: "english",
    name: "English Language",
    icon: "PencilIcon",
    progress: 35,
    accuracy: 61.4,
    solved: 38,
    total: 109,
  },
];

// ── Steam Wave — Subtopic Performance Data ────────────────────────────
// Each subtopic includes accuracy, questions attempted, and questions solved.
// A minimum threshold of attempted questions is used to make classifications meaningful.
const MIN_ATTEMPTED = 5;

export const subtopicPerformance = [
  { name: "Number System", accuracy: 88, attempted: 62, solved: 55 },
  { name: "Percentage", accuracy: 83, attempted: 45, solved: 37 },
  { name: "Profit & Loss", accuracy: 81, attempted: 38, solved: 31 },
  { name: "Data Sufficiency", accuracy: 79, attempted: 32, solved: 25 },
  { name: "Time & Work", accuracy: 68, attempted: 41, solved: 28 },
  { name: "Probability", accuracy: 65, attempted: 29, solved: 19 },
  { name: "Ratio & Proportion", accuracy: 72, attempted: 35, solved: 25 },
  { name: "Simple Interest", accuracy: 74, attempted: 28, solved: 21 },
  { name: "Compound Interest", accuracy: 69, attempted: 24, solved: 17 },
  { name: "Averages", accuracy: 76, attempted: 33, solved: 25 },
  { name: "Seating Arrangement", accuracy: 46, attempted: 22, solved: 10 },
  { name: "Logical Puzzles", accuracy: 49, attempted: 31, solved: 15 },
  { name: "Geometry", accuracy: 52, attempted: 26, solved: 14 },
  { name: "Blood Relations", accuracy: 55, attempted: 18, solved: 10 },
  { name: "Direction Sense", accuracy: 58, attempted: 15, solved: 9 },
];

/**
 * Classify subtopics into strengths, average, and weaknesses.
 * Uses a minimum-activity threshold so trivial subtopics are excluded.
 */
export function getClassifiedSubtopics() {
  const filtered = subtopicPerformance.filter(
    (s) => s.attempted >= MIN_ATTEMPTED
  );

  const sorted = [...filtered].sort((a, b) => b.accuracy - a.accuracy);

  const strengths = sorted.slice(0, 3);
  const weaknesses = [...sorted].reverse().slice(0, 3);
  const average = sorted.slice(3, -3);

  return { strengths, weaknesses, average, all: sorted };
}

// ── Time / Practice Analysis ──────────────────────────────────────────
export const timePracticeAnalysis = {
  "6m": {
    totalPracticeTime: "24h 35m",
    avgSessionDuration: "32 min",
    practiceFrequency: {
      value: 4.2,
      unit: "sessions / week",
    },
  },
  "1y": {
    totalPracticeTime: "62h 10m",
    avgSessionDuration: "28 min",
    practiceFrequency: {
      value: 3.8,
      unit: "sessions / week",
    },
  },
  "3m": {
    totalPracticeTime: "12h 48m",
    avgSessionDuration: "35 min",
    practiceFrequency: {
      value: 3.1,
      unit: "sessions / week",
    },
  },
  all: {
    totalPracticeTime: "62h 10m",
    avgSessionDuration: "28 min",
    practiceFrequency: {
      value: 3.8,
      unit: "sessions / week",
    },
  },
};

// ── Monthly Activity Heatmap Data ─────────────────────────────────────
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildProgressHeatmap(cols = 26) {
  const rand = mulberry32(99);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weeks = [];
  for (let w = cols - 1; w >= 0; w--) {
    const date = new Date(today);
    date.setDate(today.getDate() - (w * 7 + 6));
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
