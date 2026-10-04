// Badge definitions — the only place badge codes are defined.
// Seed and evaluation must reference these, never raw strings.
//
// A badge is a product-level achievement (code stable forever: clients and
// tests key off it). Evaluation rules live in badge.service.js.
export const BADGE_DEFINITIONS = [
  {
    code: "FIRST_SOLVE",
    name: "First Step",
    description: "Solve your first aptitude question.",
    icon: "FootprintIcon",
    category: "questions",
  },
  {
    code: "TEN_SOLVES",
    name: "Getting Started",
    description: "Solve 10 aptitude questions.",
    icon: "TargetIcon",
    category: "questions",
  },
  {
    code: "HUNDRED_SOLVES",
    name: "Century Club",
    description: "Solve 100 aptitude questions.",
    icon: "ZapIcon",
    category: "questions",
  },
  {
    code: "SEVEN_DAY_STREAK",
    name: "Week Warrior",
    description: "Practice on 7 consecutive days.",
    icon: "FlameIcon",
    category: "consistency",
  },
  {
    code: "FIRST_TEST",
    name: "First Test",
    description: "Complete your first test session.",
    icon: "ClipboardCheckIcon",
    category: "testing",
  },
  {
    code: "PERFECT_SESSION",
    name: "Flawless",
    description: "Score 100% in a completed session of at least 5 questions.",
    icon: "TrophyIcon",
    category: "skill",
  },
];

export const isKnownBadge = (code) =>
  BADGE_DEFINITIONS.some((b) => b.code === code);
