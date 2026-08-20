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

// Performance summary card data
export const performanceSummary = {
  questionsSolved: 324,
  totalSessions: 28,
  overallAccuracy: 81,
  questionsAttempted: 42,
  // Difficulty breakdown
  easy: { solved: 142, total: 200 },
  medium: { solved: 138, total: 500 },
  hard: { solved: 44, total: 300 },
  // Session breakdown
  practiceSessions: 18,
  testSessions: 10,
};

// Streak & achievements card data
export const streakData = {
  currentStreak: 7,
  longestStreak: 18,
  totalActiveDays: 42,
  badgesEarned: 5,
  recentBadge: { name: "Week Warrior", emoji: "🔥" },
  badges: [
    { name: "First Step", emoji: "🎯", earned: true },
    { name: "Week Warrior", emoji: "🔥", earned: true },
    { name: "Century Club", emoji: "💯", earned: true },
    { name: "Sharpshooter", emoji: "🏹", earned: true },
    { name: "Speed Demon", emoji: "⚡", earned: true },
  ],
};

// User progress per subtopic (subtopicId → { solved, total })
export const subtopicProgress = {
  // Quantitative
  "quant-1": { solved: 17, total: 24 },   // Profit & Loss 71%
  "quant-2": { solved: 14, total: 32 },   // Percentage 44%
  "quant-3": { solved: 4, total: 18 },     // Ratio & Proportion 22%
  "quant-4": { solved: 15, total: 21 },    // Time & Work 71%
  "quant-5": { solved: 8, total: 26 },     // Time, Speed & Distance 31%
  "quant-6": { solved: 12, total: 16 },    // Averages 75%
  "quant-7": { solved: 12, total: 30 },    // Number System 40%
  "quant-8": { solved: 7, total: 20 },     // Probability 35%
  "quant-9": { solved: 9, total: 15 },     // Simple & Compound Interest 60%
  "quant-10": { solved: 5, total: 14 },    // Permutation & Combination 36%
  "quant-11": { solved: 0, total: 22 },    // Algebra 0%
  "quant-12": { solved: 0, total: 28 },    // Data Interpretation 0%
  // Logical
  "log-1": { solved: 9, total: 16 },       // Syllogisms 56%
  "log-2": { solved: 6, total: 12 },       // Seating Arrangement 50%
  "log-3": { solved: 3, total: 10 },       // Blood Relations 30%
  "log-4": { solved: 11, total: 18 },      // Coding-Decoding 61%
  "log-5": { solved: 0, total: 14 },       // Direction Sense 0%
  "log-6": { solved: 0, total: 20 },       // Puzzles 0%
  "log-7": { solved: 0, total: 12 },       // Inequality 0%
  "log-8": { solved: 0, total: 15 },       // Series Completion 0%
  // Verbal
  "ver-1": { solved: 11, total: 20 },      // Synonyms & Antonyms 55%
  "ver-2": { solved: 7, total: 14 },       // Sentence Correction 50%
  "ver-3": { solved: 0, total: 18 },       // Reading Comprehension 0%
  "ver-4": { solved: 0, total: 12 },       // Fill in the Blanks 0%
  "ver-5": { solved: 0, total: 10 },       // Para Jumbles 0%
  "ver-6": { solved: 0, total: 16 },       // Error Spotting 0%
};

// ═══════════════════════════════════════════════════════════════════════
// PRACTICE SHEETS (per subtopic)
// ═══════════════════════════════════════════════════════════════════════

// practiceSheets[subtopicId] = array of sessions
export const practiceSheets = {
  "quant-1": [
    {
      id: "q1-s1",
      session: 1,
      difficulty: "Easy",
      questions: [
        { id: "q1", title: "A shopkeeper buys goods at 20% discount and sells at 10% above cost price. Find the profit percent.", difficulty: "Easy" },
        { id: "q2", title: "If the cost price of 12 articles is equal to the selling price of 10 articles, find the profit percent.", difficulty: "Easy" },
        { id: "q3", title: "A product is sold at 25% profit. If it had been sold at 10% less, what would have been the profit percent?", difficulty: "Easy" },
        { id: "q4", title: "Find the selling price if the cost price is ₹500 and profit is 15%.", difficulty: "Easy" },
        { id: "q5", title: "A man sells an article at a loss of 10%. If he had sold it for ₹45 more, he would have gained 5%. Find the cost price.", difficulty: "Easy" },
        { id: "q6", title: "The marked price of an article is ₹800. After allowing a 15% discount, the seller still makes a 10% profit. Find the cost price.", difficulty: "Easy" },
        { id: "q7", title: "By selling 33m of cloth, a person gains the selling price of 11m. Find the gain percent.", difficulty: "Easy" },
        { id: "q8", title: "If the selling price is doubled, the profit triples. Find the profit percent.", difficulty: "Easy" },
        { id: "q9", title: "A trader mixing two varieties of rice worth ₹30/kg and ₹40/kg in ratio 2:3. Find the selling price per kg at 10% profit.", difficulty: "Easy" },
        { id: "q10", title: "Find the gain or loss percent when CP = ₹600 and SP = ₹540.", difficulty: "Easy" },
      ],
      solved: 10,
      accuracy: 80,
    },
    {
      id: "q1-s2",
      session: 2,
      difficulty: "Easy",
      questions: [
        { id: "q11", title: "A shopkeeper marks his goods 40% above cost price and gives a 20% discount. Find profit percent.", difficulty: "Easy" },
        { id: "q12", title: "If profit is 25% of SP, find the profit as a percentage of CP.", difficulty: "Easy" },
        { id: "q13", title: "By selling at ₹52.50, a gain of 5% is made. At what price should it be sold to gain 10%?", difficulty: "Easy" },
        { id: "q14", title: "A man buys 10 oranges for ₹80 and sells 8 for ₹80. Find his profit percent.", difficulty: "Easy" },
        { id: "q15", title: "The cost price of 20 articles equals the selling price of 15 articles. Find profit percent.", difficulty: "Easy" },
        { id: "q16", title: "If a book bought for ₹200 is sold at 15% loss, find the selling price.", difficulty: "Easy" },
        { id: "q17", title: "Two successive discounts of 10% and 20% are equivalent to a single discount of what percent?", difficulty: "Easy" },
        { id: "q18", title: "A shopkeeper earns 20% profit after giving a 10% discount. Find the ratio of CP to MP.", difficulty: "Easy" },
        { id: "q19", title: "Find the selling price when CP = ₹250 and loss = 8%.", difficulty: "Easy" },
        { id: "q20", title: "If 5% more is gained by selling an article for ₹350 than for ₹340, find the cost price.", difficulty: "Easy" },
      ],
      solved: 7,
      accuracy: 71,
    },
    {
      id: "q1-s3",
      session: 3,
      difficulty: "Medium",
      questions: [
        { id: "q21", title: "A man sells two chairs at ₹500 each. On one he gains 20% and on the other he loses 20%. Find the overall gain or loss.", difficulty: "Medium" },
        { id: "q22", title: "The selling price of 12 pencils equals the cost price of 15 pencils. Find the gain percent.", difficulty: "Medium" },
        { id: "q23", title: "A trader allows a 10% cash discount and still makes a 20% profit. Find the marked price if CP = ₹270.", difficulty: "Medium" },
        { id: "q24", title: "By selling a watch at ₹405, there is a loss of 10%. At what price should it be sold to gain 10%?", difficulty: "Medium" },
        { id: "q25", title: "A shopkeeper buys an article for ₹800 and spends ₹200 on repairs. He sells it for ₹1200. Find his profit percent.", difficulty: "Medium" },
        { id: "q26", title: "If the selling price of an article is 1.5 times the cost price, find the profit percent.", difficulty: "Medium" },
        { id: "q27", title: "Find the single equivalent discount to three successive discounts of 10%, 20% and 30%.", difficulty: "Medium" },
        { id: "q28", title: "A fruit seller buys oranges at 10 for ₹80 and sells at 8 for ₹100. Find his gain or loss percent.", difficulty: "Medium" },
        { id: "q29", title: "Two articles are sold at the same price. One at 20% profit and the other at 20% loss. Find the overall profit or loss.", difficulty: "Medium" },
        { id: "q30", title: "A dealer marks his goods 30% above CP and allows 15% discount. Find his profit percent.", difficulty: "Medium" },
      ],
      solved: 4,
      accuracy: 50,
    },
    {
      id: "q1-s4",
      session: 4,
      difficulty: "Medium",
      questions: [
        { id: "q31", title: "A shopkeeper sells a TV at 10% profit and a fridge at 10% loss. If the TV costs ₹20,000 and fridge costs ₹15,000, find overall profit or loss.", difficulty: "Medium" },
        { id: "q32", title: "If the CP of 20 oranges is equal to SP of 16 oranges, find the gain percent.", difficulty: "Medium" },
        { id: "q33", title: "A man invests ₹20,000 in a business. After one year he gets ₹25,000 back. Find his profit percent.", difficulty: "Medium" },
        { id: "q34", title: "An article marked at ₹500 is available at two successive discounts of 10% and 20%. Find the selling price.", difficulty: "Medium" },
        { id: "q35", title: "By selling an article for ₹480, a person loses 20%. At what price should he sell to gain 25%?", difficulty: "Medium" },
        { id: "q36", title: "A trader mixes two types of sugar: 20 kg at ₹30/kg and 30 kg at ₹40/kg. At what price per kg should he sell to gain 20%?", difficulty: "Medium" },
        { id: "q37", title: "Find the cost price if selling price = ₹720 and profit = 20%.", difficulty: "Medium" },
        { id: "q38", title: "A shopkeeper marks goods 50% above CP and gives 25% discount. Find profit percent.", difficulty: "Medium" },
        { id: "q39", title: "If the SP of an article is 80% of its marked price, find the profit percent if it was marked 25% above CP.", difficulty: "Medium" },
        { id: "q40", title: "A man sells a bicycle at 10% gain. If he had sold it for ₹100 more, he would have gained 15%. Find the cost price.", difficulty: "Medium" },
      ],
      solved: 0,
      accuracy: 0,
    },
    {
      id: "q1-s5",
      session: 5,
      difficulty: "Hard",
      questions: [
        { id: "q41", title: "A shopkeeper buys an article at 20% discount on the marked price. He marks it 30% above the price he paid. After giving a 10% discount on the marked price, find his overall profit percent.", difficulty: "Hard" },
        { id: "q42", title: "A trader professes to sell his goods at CP but uses a weight of 800g for 1 kg. Find his gain percent.", difficulty: "Hard" },
        { id: "q43", title: "If the profit on an article is 20% of the selling price, find the profit as a percentage of the cost price.", difficulty: "Hard" },
        { id: "q44", title: "A man sells two watches for ₹5445 each. On one he gains 10% and on the other he loses 10%. Find the overall gain or loss percent.", difficulty: "Hard" },
        { id: "q45", title: "A dealer marks goods at 40% above CP and gives two successive discounts of 10% and 15%. Find his profit or loss percent.", difficulty: "Hard" },
        { id: "q46", title: "By selling 12 apples for ₹100, a loss of 20% is incurred. At what price per dozen should they be sold to gain 25%?", difficulty: "Hard" },
        { id: "q47", title: "A person sells 100 pens at a profit of 20%. If he sells 50 pens at cost price, find the profit percent on the remaining 50 pens.", difficulty: "Hard" },
        { id: "q48", title: "A shopkeeper allows 20% discount on marked price and still makes 20% profit. If CP = ₹160, find the marked price.", difficulty: "Hard" },
        { id: "q49", title: "A man buys a horse and a carriage for ₹20,000. He sells the horse at 20% profit and the carriage at 10% loss. If he gains 2% overall, find the cost price of the horse.", difficulty: "Hard" },
        { id: "q50", title: "A shopkeeper defrauds by 10% in buying and 10% in selling. Find his overall gain percent.", difficulty: "Hard" },
      ],
      solved: 0,
      accuracy: 0,
    },
  ],
};

// Helper: get aggregate stats for a subtopic's practice sheets
export function getSubtopicSheetStats(subtopicId) {
  const sheets = practiceSheets[subtopicId] ?? [];
  let totalSolved = 0;
  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalAttempted = 0;
  let completedSessions = 0;

  sheets.forEach((sheet) => {
    totalQuestions += sheet.questions.length;
    totalSolved += sheet.solved;
    totalAttempted += sheet.solved;
    totalCorrect += Math.round((sheet.accuracy / 100) * sheet.solved);
    if (sheet.solved === sheet.questions.length) completedSessions++;
  });

  return {
    totalQuestions,
    solved: totalSolved,
    accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
    completedSessions,
    totalSessions: sheets.length,
  };
}

// Heatmap summary stats
export const heatmapStats = {
  questionsSolved: 324,
  totalActiveDays: 42,
  maxStreak: 18,
  currentStreak: 7,
};

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

// ═══════════════════════════════════════════════════════════════════════
// BADGES / ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════════════

export const BADGE_PATHS = {
  questions: "Question Solving",
  consistency: "Consistency",
  skill: "Skill & Performance",
  mastery: "Topic Mastery",
  testing: "Test Preparation",
};

export const badges = [
  {
    id: "first-step",
    name: "First Step",
    description: "Solve your first aptitude question.",
    icon: "FootprintIcon",
    path: "questions",
    requirement: "Solve 1 question",
    earned: true,
    earnedAt: "Jan 5, 2026",
  },
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Solve 10 aptitude questions.",
    icon: "TargetIcon",
    path: "questions",
    requirement: "Solve 10 questions",
    earned: true,
    earnedAt: "Jan 12, 2026",
  },
  {
    id: "question-hunter",
    name: "Question Hunter",
    description: "Solve 50 aptitude questions.",
    icon: "TargetIcon",
    path: "questions",
    requirement: "Solve 50 questions",
    earned: true,
    earnedAt: "Feb 3, 2026",
  },
  {
    id: "problem-crusher",
    name: "Problem Crusher",
    description: "Solve 100 aptitude questions.",
    icon: "ZapIcon",
    path: "questions",
    requirement: "Solve 100 questions",
    earned: true,
    earnedAt: "Mar 10, 2026",
  },
  {
    id: "sharp-mind",
    name: "Sharp Mind",
    description: "Maintain 80% accuracy across 50 attempts.",
    icon: "BrainIcon",
    path: "skill",
    requirement: "80% accuracy on 50+ attempts",
    earned: true,
    earnedAt: "Mar 18, 2026",
  },
  {
    id: "consistent-learner",
    name: "Consistent Learner",
    description: "Practice for 7 consecutive days.",
    icon: "FlameIcon",
    path: "consistency",
    requirement: "7-day practice streak",
    earned: true,
    earnedAt: "Feb 14, 2026",
  },
  {
    id: "unstoppable",
    name: "Unstoppable",
    description: "Practice for 30 consecutive days.",
    icon: "FlameIcon",
    path: "consistency",
    requirement: "30-day practice streak",
    earned: false,
    earnedAt: null,
  },
  {
    id: "topic-master",
    name: "Topic Master",
    description: "Complete all available questions in a subtopic.",
    icon: "TrophyIcon",
    path: "mastery",
    requirement: "Complete a subtopic",
    earned: false,
    earnedAt: null,
  },
  {
    id: "test-ready",
    name: "Test Ready",
    description: "Complete 10 practice tests.",
    icon: "ClipboardCheckIcon",
    path: "testing",
    requirement: "Complete 10 test sessions",
    earned: false,
    earnedAt: null,
  },
  {
    id: "aptitude-ace",
    name: "Aptitude Ace",
    description: "Reach 500 solved questions.",
    icon: "CrownIcon",
    path: "questions",
    requirement: "Solve 500 questions",
    earned: false,
    earnedAt: null,
  },
];

// Badges sorted for dashboard: earned first (most recent), then locked previews
export function getDashboardBadges(count = 3) {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);
  return [...earned, ...locked].slice(0, count);
}

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
