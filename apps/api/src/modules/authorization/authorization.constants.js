// Permission vocabulary — the only place permission names are defined.
// Middleware, seed, and tests must reference these, never raw strings.
//
// Convention: resource:action. A permission is a real application capability
// exposed through an API, not an internal service operation.

export const ROLES = {
  USER: {
    name: "USER",
    description: "Learner. Reads content, owns practice data and profile.",
  },
  ADMIN: {
    name: "ADMIN",
    description:
      "Content administrator. Everything a learner can do, plus content writes.",
  },
};

export const PERMISSIONS = {
  // Content reads — every authenticated user.
  "topics:read": "List topics and their subtopics",
  "subtopics:read": "List subtopics of a topic",
  "questions:read": "List questions and view question details (no solutions)",
  "sheets:read": "List company sheets metadata",

  // Content writes — admin only in V1.
  "topics:create": "Create a topic",
  "topics:update": "Update a topic",
  "topics:delete": "Delete a topic (cascades subtopics and questions)",
  "subtopics:create": "Create a subtopic",
  "subtopics:update": "Update a subtopic",
  "subtopics:delete": "Delete a subtopic (cascades questions)",
  "questions:create": "Create a question with options and solution",
  "questions:update": "Update a question",
  "questions:delete": "Delete a question and its options",
  "sheets:create": "Create a company sheet with its question set",
  "sheets:update": "Update a company sheet, including its question set",
  "sheets:delete": "Delete a company sheet",

  // Practice — self-scoped, ownership enforced separately.
  "practice:create": "Start a practice session for self",
  "practice:read": "Read own practice session",
  "practice:complete": "Complete own practice session",
  "attempts:create": "Submit an attempt in own active session",
  "results:read": "Read results of own completed session",

  // Profile — self-scoped.
  "profile:read": "Read own profile, stats, history, heatmap and skills",
};

// `profile:update` is intentionally absent: no such endpoint exists yet.
// `users:*` and `discussions:*` are absent: no such APIs exist yet.

const USER_PERMISSIONS = [
  "topics:read",
  "subtopics:read",
  "questions:read",
  "sheets:read",
  "practice:create",
  "practice:read",
  "practice:complete",
  "attempts:create",
  "results:read",
  "profile:read",
];

export const ROLE_PERMISSIONS = {
  USER: USER_PERMISSIONS,
  // ADMIN = everything a learner can do, plus all content writes.
  ADMIN: Object.keys(PERMISSIONS),
};

export const isKnownPermission = (name) =>
  Object.prototype.hasOwnProperty.call(PERMISSIONS, name);
