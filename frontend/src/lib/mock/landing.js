// Dummy data for the landing page — replace with API calls later.
// Shapes mirror the backend responses where possible.

export const trustStats = [
  { value: "300+", label: "Questions" },
  { value: "50+", label: "Subtopics" },
  { value: "20+", label: "Company Sheets" },
  { value: "1000+", label: "Practice Sessions" },
];

export const topics = [
  {
    id: "quant",
    title: "Quantitative Aptitude",
    description: "Numbers, percentages, ratios and the calculations behind them.",
    subtopics: [
      { name: "Profit & Loss", questions: 24 },
      { name: "Time & Work", questions: 18 },
      { name: "Number System", questions: 30 },
      { name: "Probability", questions: 15 },
    ],
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    description: "Patterns, puzzles, syllogisms and structured thinking.",
    subtopics: [
      { name: "Syllogisms", questions: 16 },
      { name: "Seating Arrangement", questions: 12 },
      { name: "Blood Relations", questions: 10 },
    ],
  },
  {
    id: "verbal",
    title: "Verbal Ability",
    description: "Grammar, vocabulary and reading comprehension.",
    subtopics: [
      { name: "Synonyms & Antonyms", questions: 20 },
      { name: "Sentence Correction", questions: 14 },
    ],
  },
];

export const companies = [
  {
    id: "tcs",
    name: "TCS",
    initial: "T",
    difficulty: "MEDIUM",
    estimatedTime: "1:30",
    questions: 150,
    description: "TCS NQT style — quantitative, logical and verbal mix.",
  },
  {
    id: "infosys",
    name: "Infosys",
    initial: "I",
    difficulty: "MEDIUM",
    estimatedTime: "1:15",
    questions: 120,
    description: "Infosys placement pattern with puzzles and reasoning.",
  },
  {
    id: "accenture",
    name: "Accenture",
    initial: "A",
    difficulty: "HARD",
    estimatedTime: "1:00",
    questions: 90,
    description: "Cognito-style assessment questions with tight timing.",
  },
  {
    id: "capgemini",
    name: "Capgemini",
    initial: "C",
    difficulty: "EASY",
    estimatedTime: "0:50",
    questions: 75,
    description: "Foundation level questions to build test-day confidence.",
  },
];

export const discussions = [
  {
    id: "d1",
    title: "How to solve Probability faster?",
    snippet: "I keep spending 3+ minutes on probability questions in tests…",
    tag: "Probability",
    replies: 12,
    likes: 34,
    author: "Anish",
    time: "2h ago",
  },
  {
    id: "d2",
    title: "Best resources for Logical Reasoning?",
    snippet: "Anyone found a structured way to practice syllogisms and puzzles…",
    tag: "Reasoning",
    replies: 8,
    likes: 21,
    author: "Priya",
    time: "5h ago",
  },
  {
    id: "d3",
    title: "Time & Work shortcuts that actually work",
    snippet: "Sharing the LCM method I use — cuts most Time & Work problems…",
    tag: "Quant",
    replies: 19,
    likes: 47,
    author: "Rahul",
    time: "1d ago",
  },
];
