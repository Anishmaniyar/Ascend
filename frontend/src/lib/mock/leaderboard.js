// ═══════════════════════════════════════════════════════════════════════
// LEADERBOARD MOCK DATA
// ═══════════════════════════════════════════════════════════════════════

const AVATARS = [
  { initials: "AK", bg: "bg-ember/10", color: "text-ember" },
  { initials: "RS", bg: "bg-success/10", color: "text-success" },
  { initials: "PM", bg: "bg-brass/10", color: "text-brass" },
  { initials: "NK", bg: "bg-graphite/10", color: "text-graphite" },
  { initials: "SJ", bg: "bg-ember/10", color: "text-ember" },
  { initials: "VR", bg: "bg-success/10", color: "text-success" },
  { initials: "TD", bg: "bg-brass/10", color: "text-brass" },
  { initials: "LM", bg: "bg-graphite/10", color: "text-graphite" },
  { initials: "GS", bg: "bg-ember/10", color: "text-ember" },
  { initials: "RP", bg: "bg-success/10", color: "text-success" },
  { initials: "AN", bg: "bg-brass/10", color: "text-brass" },
  { initials: "KD", bg: "bg-graphite/10", color: "text-graphite" },
  { initials: "MB", bg: "bg-ember/10", color: "text-ember" },
  { initials: "SK", bg: "bg-success/10", color: "text-success" },
  { initials: "JT", bg: "bg-brass/10", color: "text-brass" },
  { initials: "CW", bg: "bg-graphite/10", color: "text-graphite" },
  { initials: "HX", bg: "bg-ember/10", color: "text-ember" },
  { initials: "YZ", bg: "bg-success/10", color: "text-success" },
  { initials: "DF", bg: "bg-brass/10", color: "text-brass" },
  { initials: "BN", bg: "bg-graphite/10", color: "text-graphite" },
  { initials: "WP", bg: "bg-ember/10", color: "text-ember" },
  { initials: "QH", bg: "bg-success/10", color: "text-success" },
  { initials: "FX", bg: "bg-brass/10", color: "text-brass" },
  { initials: "CL", bg: "bg-graphite/10", color: "text-graphite" },
  { initials: "UT", bg: "bg-ember/10", color: "text-ember" },
  { initials: "EJ", bg: "bg-success/10", color: "text-success" },
  { initials: "MI", bg: "bg-brass/10", color: "text-brass" },
  { initials: "ZV", bg: "bg-graphite/10", color: "text-graphite" },
  { initials: "OW", bg: "bg-ember/10", color: "text-ember" },
  { initials: "GY", bg: "bg-success/10", color: "text-success" },
];

function generateLeaderboard() {
  const names = [
    "Arjun Kumar",
    "Riya Sharma",
    "Priya Mehta",
    "Nikhil Kapoor",
    "Sneha Joshi",
    "Vikram Rao",
    "Tanvi Desai",
    "Lakshmi Menon",
    "Gaurav Singh",
    "Rohit Patel",
    "Anish Maniyar",
    "Kavya Das",
    "Mohit Bhatt",
    "Sakshi Kulkarni",
    "Jay Thakur",
    "Chetan Wagle",
    "Harsh Xavier",
    "Yash Zende",
    "Dhruv Fernandes",
    "Bhavna Nair",
    "Wesley Paul",
    "Quinn Harper",
    "Felix Xavier",
    "Casey Lin",
    "Uma Trivedi",
    "Ethan James",
    "Maya Iyer",
    "Zara Vaidya",
    "Owen Grace",
    "Gia Young",
  ];

  const entries = names.map((name, i) => {
    const avatar = AVATARS[i % AVATARS.length];
    const questionsSolved = Math.max(40, 186 - i * 6 + Math.floor(Math.random() * 10));
    const accuracy = Math.max(55, Math.min(98, 92 - i * 0.8 + Math.floor(Math.random() * 6)));
    const sessions = Math.max(3, 24 - Math.floor(i * 0.7) + Math.floor(Math.random() * 4));
    const streak = Math.max(0, 16 - Math.floor(i * 0.5) + Math.floor(Math.random() * 3));
    const score = Math.round(questionsSolved * 4 + accuracy * 2 + sessions * 3 + streak * 5);

    return {
      rank: i + 1,
      name,
      initials: avatar.initials,
      avatarBg: avatar.bg,
      avatarColor: avatar.color,
      questionsSolved,
      accuracy,
      sessions,
      streak,
      score,
      isCurrentUser: name === "Anish Maniyar",
    };
  });

  // Sort by score descending
  entries.sort((a, b) => b.score - a.score);
  entries.forEach((e, i) => (e.rank = i + 1));

  return entries;
}

export const leaderboardData = generateLeaderboard();

// Current user's data (always shown in "Your Rank" section)
export const currentUserRank = leaderboardData.find((e) => e.isCurrentUser) || {
  rank: 347,
  name: "Anish Maniyar",
  initials: "AM",
  avatarBg: "bg-ember/10",
  avatarColor: "text-ember",
  questionsSolved: 74,
  accuracy: 81,
  sessions: 12,
  streak: 7,
  score: 610,
  isCurrentUser: true,
};

// Time period reset info
export const resetInfo = {
  weekly: "Resets every Monday at 12:00 AM IST",
  monthly: "Resets on the 1st of each month",
  alltime: "All-time cumulative rankings",
};

// Items per page for pagination
export const LEADERBOARD_PAGE_SIZE = 10;
