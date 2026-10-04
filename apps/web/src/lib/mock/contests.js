// ═══════════════════════════════════════════════════════════════════════
// CONTESTS MOCK DATA
// ═══════════════════════════════════════════════════════════════════════

// Upcoming contests
export const upcomingContests = {
  weekly: {
    id: "weekly-next",
    title: "Weekly Aptitude Contest",
    type: "Weekly",
    difficulty: "Medium",
    description: "Mixed aptitude questions from all topics.",
    secondaryDescription: "This contest tests your overall aptitude ability across Quantitative, Logical, Verbal, and Data Interpretation. Compete with peers and see where you stand.",
    date: "2026-08-31T10:00:00",
    day: "Sunday",
    startTime: "10:00 AM",
    duration: 60,
    questions: 30,
    participants: 12400,
    registered: false,
  },
  company: {
    id: "company-next",
    title: "TCS Aptitude Contest",
    type: "Company Focused",
    difficulty: "Hard",
    description: "Questions based on real TCS placement patterns.",
    secondaryDescription: "Practice with questions modeled on actual TCS aptitude tests. Includes Quantitative, Logical, and Verbal sections typical of TCS placement exams.",
    company: "TCS",
    date: "2026-09-02T14:00:00",
    day: "Tuesday",
    startTime: "2:00 PM",
    duration: 45,
    questions: 25,
    participants: 8200,
    registered: true,
  },
};

// Past contest results
export const pastContests = [
  { id: "pc-1", name: "Weekly Aptitude Contest #45", type: "Weekly", date: "2026-08-24", score: 24, total: 30, rank: 142, totalParticipants: 1243, percentile: 88.5 },
  { id: "pc-2", name: "TCS Aptitude Contest #18", type: "Company", date: "2026-08-19", score: 18, total: 25, rank: 215, totalParticipants: 987, percentile: 78.2 },
  { id: "pc-3", name: "Weekly Aptitude Contest #44", type: "Weekly", date: "2026-08-17", score: 26, total: 30, rank: 98, totalParticipants: 1180, percentile: 91.7 },
  { id: "pc-4", name: "Infosys Aptitude Contest #12", type: "Company", date: "2026-08-12", score: 15, total: 20, rank: 312, totalParticipants: 856, percentile: 63.5 },
  { id: "pc-5", name: "Weekly Aptitude Contest #43", type: "Weekly", date: "2026-08-10", score: 22, total: 30, rank: 178, totalParticipants: 1105, percentile: 83.9 },
  { id: "pc-6", name: "Accenture Aptitude Contest #8", type: "Company", date: "2026-08-05", score: 20, total: 25, rank: 156, totalParticipants: 742, percentile: 80.1 },
  { id: "pc-7", name: "Weekly Aptitude Contest #42", type: "Weekly", date: "2026-08-03", score: 28, total: 30, rank: 45, totalParticipants: 1050, percentile: 95.7 },
  { id: "pc-8", name: "Wipro Aptitude Contest #6", type: "Company", date: "2026-07-29", score: 12, total: 20, rank: 425, totalParticipants: 680, percentile: 37.5 },
  { id: "pc-9", name: "Weekly Aptitude Contest #41", type: "Weekly", date: "2026-07-27", score: 25, total: 30, rank: 89, totalParticipants: 980, percentile: 90.9 },
  { id: "pc-10", name: "TCS Aptitude Contest #17", type: "Company", date: "2026-07-22", score: 19, total: 25, rank: 198, totalParticipants: 920, percentile: 78.5 },
  { id: "pc-11", name: "Weekly Aptitude Contest #40", type: "Weekly", date: "2026-07-20", score: 21, total: 30, rank: 210, totalParticipants: 1020, percentile: 79.4 },
  { id: "pc-12", name: "Infosys Aptitude Contest #11", type: "Company", date: "2026-07-15", score: 16, total: 20, rank: 267, totalParticipants: 810, percentile: 67.0 },
];

export const PAST_PAGE_SIZE = 8;

// ─── Detailed contest results (for the detail page) ────────────────────
export const contestDetails = {
  "pc-1": {
    id: "pc-1",
    name: "Weekly Aptitude Contest #45",
    type: "Weekly",
    date: "2026-08-24",
    duration: 60,
    total: 30,
    status: "Completed",
    // Result summary
    score: 24,
    accuracy: 80,
    rank: 142,
    totalParticipants: 1243,
    percentile: 88.5,
    // Performance overview
    correct: 24,
    incorrect: 4,
    unattempted: 2,
    timeTaken: 42,
    // Difficulty breakdown
    difficultyBreakdown: [
      { level: "Easy", correct: 10, total: 10, accuracy: 100 },
      { level: "Medium", correct: 9, total: 12, accuracy: 75 },
      { level: "Hard", correct: 5, total: 8, accuracy: 62.5 },
    ],
    // Topic performance
    topicPerformance: [
      { topic: "Quantitative Aptitude", correct: 8, total: 10, accuracy: 80 },
      { topic: "Logical Reasoning", correct: 7, total: 9, accuracy: 77.8 },
      { topic: "Verbal Ability", correct: 5, total: 6, accuracy: 83.3 },
      { topic: "Data Interpretation", correct: 4, total: 5, accuracy: 80 },
    ],
    // Insights
    insights: [
      "Strong performance in Quantitative Aptitude.",
      "Your accuracy dropped on harder questions.",
      "Your percentile places you ahead of 88.5% of participants.",
    ],
    // Questions for review
    questions: [
      { id: 1, topic: "Quantitative Aptitude", difficulty: "Easy", question: "What is 15% of 240?", options: ["32", "36", "40", "44"], correct: 1, userAnswer: 1, status: "correct" },
      { id: 2, topic: "Quantitative Aptitude", difficulty: "Easy", question: "If a car travels 180 km in 3 hours, what is its speed?", options: ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], correct: 2, userAnswer: 2, status: "correct" },
      { id: 3, topic: "Quantitative Aptitude", difficulty: "Medium", question: "A shopkeeper offers 20% discount on an item and still makes a 25% profit. If the cost price is ₹800, what is the marked price?", options: ["₹1200", "₹1250", "₹1300", "₹1350"], correct: 1, userAnswer: 1, status: "correct" },
      { id: 4, topic: "Logical Reasoning", difficulty: "Easy", question: "In a code language, if APPLE = 50, ORANGE = 60, what does GRAPE equal?", options: ["45", "50", "55", "60"], correct: 1, userAnswer: 1, status: "correct" },
      { id: 5, topic: "Logical Reasoning", difficulty: "Medium", question: "If all roses are flowers and some flowers fade quickly, which statement is definitely true?", options: ["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "All flowers are roses"], correct: 1, userAnswer: 0, status: "incorrect" },
      { id: 6, topic: "Verbal Ability", difficulty: "Easy", question: "Choose the synonym of 'Ephemeral':", options: ["Permanent", "Fleeting", "Eternal", "Stable"], correct: 1, userAnswer: 1, status: "correct" },
      { id: 7, topic: "Data Interpretation", difficulty: "Medium", question: "Based on the chart, what was the percentage increase in sales from Q1 to Q2?", options: ["10%", "15%", "20%", "25%"], correct: 2, userAnswer: 2, status: "correct" },
      { id: 8, topic: "Quantitative Aptitude", difficulty: "Hard", question: "A pipe fills a tank in 12 hours and another empties it in 18 hours. If both are open, how long to fill the tank?", options: ["30 hours", "36 hours", "24 hours", "40 hours"], correct: 1, userAnswer: null, status: "unattempted" },
      { id: 9, topic: "Verbal Ability", difficulty: "Medium", question: "Identify the error: 'Each of the students have submitted their assignments.'", options: ["Each of", "students have", "submitted their", "No error"], correct: 1, userAnswer: 1, status: "correct" },
      { id: 10, topic: "Logical Reasoning", difficulty: "Hard", question: "In a row of 40 students, if Ramesh is 12th from the left and Suresh is 15th from the right, how many students are between them?", options: ["12", "13", "14", "15"], correct: 1, userAnswer: null, status: "unattempted" },
    ],
  },
  "pc-2": {
    id: "pc-2",
    name: "TCS Aptitude Contest #18",
    type: "Company",
    company: "TCS",
    date: "2026-08-19",
    duration: 45,
    total: 25,
    status: "Completed",
    score: 18,
    accuracy: 72,
    rank: 215,
    totalParticipants: 987,
    percentile: 78.2,
    correct: 18,
    incorrect: 5,
    unattempted: 2,
    timeTaken: 40,
    difficultyBreakdown: [
      { level: "Easy", correct: 8, total: 8, accuracy: 100 },
      { level: "Medium", correct: 7, total: 10, accuracy: 70 },
      { level: "Hard", correct: 3, total: 7, accuracy: 42.9 },
    ],
    topicPerformance: [
      { topic: "Quantitative Aptitude", correct: 7, total: 9, accuracy: 77.8 },
      { topic: "Logical Reasoning", correct: 6, total: 8, accuracy: 75 },
      { topic: "Verbal Ability", correct: 5, total: 8, accuracy: 62.5 },
    ],
    insights: [
      "Good performance in Quantitative Aptitude.",
      "Your accuracy on Hard questions needs improvement.",
      "You scored above the average for TCS-focused contests.",
    ],
    questions: [
      { id: 1, topic: "Quantitative Aptitude", difficulty: "Easy", question: "Find the value of 2^8.", options: ["64", "128", "256", "512"], correct: 2, userAnswer: 2, status: "correct" },
      { id: 2, topic: "Logical Reasoning", difficulty: "Medium", question: "If in a certain code, NATURE is written as MTBUFD, how is CREDIT written?", options: ["BQDFHU", "BSEFJS", "BQDFHS", "BSEFHS"], correct: 2, userAnswer: 0, status: "incorrect" },
      { id: 3, topic: "Verbal Ability", difficulty: "Hard", question: "Choose the correctly spelt word:", options: ["Accomodation", "Accommodation", "Acomodation", "Accommadation"], correct: 1, userAnswer: 1, status: "correct" },
    ],
  },
  "pc-3": {
    id: "pc-3",
    name: "Weekly Aptitude Contest #44",
    type: "Weekly",
    date: "2026-08-17",
    duration: 60,
    total: 30,
    status: "Completed",
    score: 26,
    accuracy: 86.7,
    rank: 98,
    totalParticipants: 1180,
    percentile: 91.7,
    correct: 26,
    incorrect: 3,
    unattempted: 1,
    timeTaken: 55,
    difficultyBreakdown: [
      { level: "Easy", correct: 10, total: 10, accuracy: 100 },
      { level: "Medium", correct: 10, total: 12, accuracy: 83.3 },
      { level: "Hard", correct: 6, total: 8, accuracy: 75 },
    ],
    topicPerformance: [
      { topic: "Quantitative Aptitude", correct: 9, total: 10, accuracy: 90 },
      { topic: "Logical Reasoning", correct: 8, total: 10, accuracy: 80 },
      { topic: "Verbal Ability", correct: 5, total: 5, accuracy: 100 },
      { topic: "Data Interpretation", correct: 4, total: 5, accuracy: 80 },
    ],
    insights: [
      "Excellent performance in Verbal Ability — 100% accuracy.",
      "You answered almost all questions correctly.",
      "Your percentile places you ahead of 91.7% of participants.",
    ],
    questions: [],
  },
};

// User's contest participation
export const userContests = {
  participated: ["pc-1", "pc-2", "pc-3", "pc-4", "pc-5", "pc-6", "pc-7", "pc-8", "pc-9", "pc-10", "pc-11", "pc-12"],
};
