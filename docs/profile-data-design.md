# Profile Data Design — stored vs derived (Phases 1–5)

Date: 2026-10-04. Frontend-first audit. No Prisma was touched until the
table below was finished. This document is the source of truth for the
`Profile` separation; code changes are logged at the bottom.

Sources audited:
- `apps/web/src/app/(app)/profile/page.js` (sections 1–5)
- `apps/web/src/components/dashboard/DashboardSidebar.js` (profile card + skills)
- `apps/web/src/components/dashboard/ContinueCard.js`
- `apps/web/src/components/dashboard/DashboardBadges.js`, `BadgeCard.js`
- `apps/web/src/components/dashboard/PracticeHistoryList.js`
- `apps/web/src/components/dashboard/RecommendedTopics.js`
- `apps/web/src/components/charts/Heatmap.js`
- `apps/web/src/lib/mock/dashboard.js` (`user`, `profileSkills`, `performanceSummary`,
  `heatmapStats`, `continueSession`, `dailyGoal`, `skills`, `badges`, `practiceHistory`, `recommendedTopics`)
- `apps/web/src/app/(app)/settings/page.js` + `apps/web/src/lib/mock/settings.js`
  (`generalSettings`, `experienceSettings`)
- Backend baseline: `apps/api/src/modules/profile/*`,
  `apps/api/prisma/schema.prisma` (`User`), `apps/api/src/modules/auth/*`

---

## Phase 1 — Frontend audit (before touching Prisma)

Rule used for `Store?`: **Yes** = user-supplied identity/preference that must
survive recomputation → new `Profile` column (or related table).
**Derived** = computable from `Attempt` / `PracticeSession` / skills → never a
`Profile` column. **No** = does not exist as a product concept yet.

| Frontend field | Example | Source | Store? |
|---|---|---|---|
| displayName | Anish | User/Profile | Yes |
| handle | @anish_2026 | Profile | Yes |
| bio | Final year CSE · targeting TCS & Infosys | Profile | Yes |
| avatar | URL / initials fallback | Profile | Yes |
| location | Mumbai, India | Profile | Yes |
| DOB / dateOfBirth | 15 Aug 2004 | Profile | Yes |
| gender | Male / Female / Non-binary / Prefer not to say | Profile | Yes |
| GitHub | URL | Profile | Yes |
| LinkedIn | URL | Profile | Yes |
| LeetCode | URL | Profile | Yes |
| X | URL | Profile | Yes |
| website | URL | Profile | Yes |
| targetCompanies | TCS, Infosys, Wipro | Profile | Yes (JSON, Phase 5) |
| dailyGoal | 20 questions | Profile | Yes |
| memberSince | Jan 2026 | `User.createdAt` | Derived (format on read) |
| streak (current/longest) | 7 / 18 days | Attempts (+ `User.currentStreak` cache) | Derived |
| heatmap | daily count | Attempts / PracticeSession.startedAt | Derived |
| skills (Advanced/Intermediate/Fundamental) | Permutations ×14 | Attempts | Derived |
| accuracy | 82% | Attempts | Derived |
| questionsSolved / by difficulty | 324 (E/M/H split) | Attempts + Question.difficulty | Derived |
| sessions (practice vs test) | 18 / 10 | PracticeSession.mode | Derived |
| continue practice (resume) | Profit & Loss 12/20 | PracticeSession (active) + Attempts | Derived |
| practice history | session results | PracticeSession + Attempts | Derived |
| recommendations (weakest topic) | Probability 52% | Skills/Attempts | Derived |
| badges | 5 earned | UserBadge (NEW table, later) | Yes — not in this change |
| initials / userId label | AM / @anish_2026 | displayName / handle | Derived (format on read) |

What this prevents: designing `Profile` around the visual layout (donut
segments, heatmap weeks, badge cards, recommendation reasons). None of those
are columns. `Profile` holds only identity + preferences; everything else is
read through `Attempt` / `PracticeSession`, exactly like the existing
`profile.service.js` (`stats`, `history`, `heatmap`, `skills`) already does.

Backend coverage on the audit date:
- `GET /profile/` returns `id,name,email,avatar,bio` only — no handle,
  location, DOB, gender, socials, companies, goal.
- `GET /profile/stats|history|heatmap|skills` already follow the derived
  pattern above (no new columns needed for them).
- No `PATCH /profile`, no badge API, no resume-active-session API. Those are
  later phases, intentionally out of scope here.

---

## Phase 2 — Separate identity from profile

`User` stays the account: identity + auth + relations. `Profile` is the
application-facing editable card. One-to-one, profile dies with the user.

```text
User                        Profile
├── id                      ├── id
├── email                   ├── userId → User.id (UNIQUE)
├── name                    ├── displayName
├── roleId                  ├── handle (nullable, UNIQUE)
├── createdAt               ├── avatarUrl?
├── updatedAt               ├── bio?
                            ├── gender?
                            ├── dateOfBirth?
                            ├── location?
                            ├── githubUrl?
                            ├── linkedinUrl?
                            ├── leetcodeUrl?
                            ├── xUrl?
                            ├── websiteUrl?
                            ├── targetCompanies Json?
                            ├── dailyQuestionGoal (default 20)
                            ├── createdAt
                            └── updatedAt

User 1 ───────── 1 Profile
```

Never duplicated into `Profile`: `email`, `role`/`roleId`, password
(none — Google-only auth), Google `sub` (`AuthAccount.providerUserId`).
Those belong to account/authentication. `memberSince` is `User.createdAt`
formatted on read, not a column.

Transition note: `User.avatar`, `User.bio`, `User.currentStreak`,
`User.longestStreak`, `User.lastSolvedDate` still exist in `schema.prisma`
on this change. They are **not** removed here so `auth.service`,
`profile.service`, and `test/authorization.test.js` keep passing.
`Profile.displayName` / `Profile.avatarUrl` are the source of truth going
forward; dropping the legacy `User` columns is a later migration with a
backfill verification step (same pattern as the `roleId` backfill).

---

## Phase 3 — Google signup flow

Current flow (unchanged): `Google → AuthAccount → User`.

Extended flow (this change):

```text
Google
  ↓
AuthAccount
  ↓
User
  ↓
Profile
```

- First Google login → create `User` + `AuthAccount` + `Profile`
  (`Profile.displayName ← Google name`, `Profile.avatarUrl ← Google picture`,
  `handle` generated from email prefix, made unique).
- Later Google logins → find existing `Profile` → **leave it alone**
  (user may have customized name/avatar; Google must not overwrite).
- Legacy users (created before this change) → backfilled on next login
  via the same find-or-create path, plus a seed backfill (see Changes).
- Auth API response shape is unchanged in this phase (still
  `{ id, name, email, avatar }`); wiring `Profile` into reads is a later
  repository/service phase.

---

## Phase 4 — Profile Prisma model + constraints

Added to `apps/api/prisma/schema.prisma` (`Profile`, `@@map("profiles")`;
`User.profile` back-relation). Decisions:

| Field | Constraint | Why |
|---|---|---|
| `userId` | `UNIQUE`, FK → `User.id`, `onDelete: Cascade` | one User → one Profile; profile dies with user |
| `handle` | `String? @unique` | nullable because not every signup picks one immediately; unique when present (Postgres allows multiple NULLs) |
| `displayName` | required `String(100)` | always seeded from Google name; editable later |
| URL fields (`avatarUrl`, `githubUrl`, `linkedinUrl`, `leetcodeUrl`, `xUrl`, `websiteUrl`) | nullable | users don't have to provide them; Google picture may be absent |
| `bio` | nullable `Text` | same |
| `gender` | nullable `String(20)` | fixed option list enforced in service/zod later, not in DB enum (see settings.js options) |
| `dateOfBirth` | nullable `DateTime` (`@db.Date`) | same |
| `location` | nullable `String(120)` | same |
| `targetCompanies` | nullable `Json` | Phase 5 |
| `dailyQuestionGoal` | nullable `Int`, `@default(20)` | matches `dailyGoal.target = 20` mock; nullable so legacy rows need no backfill |
| `createdAt` / `updatedAt` | default / auto-update | same convention as every other model |

`User.profile` is optional (`Profile?`) so every existing
`prisma.user.create(...)` call site (incl. tests) keeps working without
supplying a profile inline.

---

## Phase 5 — targetCompanies storage decision

Frontend: `targetCompanies[]` (e.g. `["TCS", "Infosys", "Wipro"]`).

**Chosen: Option A — `targetCompanies Json?`.**

- Product query is always "this user's preferences", never "every user
  targeting Google". No joins, no filtering, no referential integrity needed.
- A `Company` table + join table is justified only when companies become a
  real domain feature (company pages, followers, sheets-per-company queries).
  Until then it is pure overhead.
- Validation (max N entries, max length, dedupe) belongs in the service/zod
  layer when `PATCH /profile` lands — not in the column type.

---

## Changes (implementation log)

1. `apps/api/prisma/schema.prisma`
   - Added `model Profile` per Phase 4 (unique `userId`, nullable-unique
     `handle`, nullable identity/preference fields, `targetCompanies Json?`,
     `dailyQuestionGoal @default(20)`, `@@map("profiles")`).
   - Added `profile Profile?` back-relation on `User`.
   - Did NOT remove `User.avatar` / `User.bio` / streak fields (see Phase 2
     transition note).
2. `apps/api/src/modules/auth/auth.repository.js`
   - Added `findProfileByUserId`, `findProfileByHandle`, `createProfile`,
     `ensureProfileForUser` (find-or-create; never overwrites an existing row).
3. `apps/api/src/modules/auth/auth.service.js`
   - `handleGoogleSignup`: new-user path creates a `Profile` (displayName ←
     Google name, avatarUrl ← Google picture, unique handle from email prefix);
     existing-user path backfills a missing `Profile` once, otherwise leaves it
     untouched (Phase 3 invariant).
   - Helper `generateUniqueHandle` resolves collisions with a numeric suffix.
4. `apps/api/scripts/seed-authorization.js`
   - Added idempotent Profile backfill for pre-existing users
     (displayName ← `User.name`, avatarUrl ← `User.avatar`, unique handle from
     email prefix). Reports `profilesBackfilled` alongside the role counts;
     safe to re-run.
5. Validation performed: `npx prisma validate`, `node --check` on edited
   service/repository/seed files. No migration executed here (needs a live DB:
   run `npx prisma migrate dev --name add-profile` then `npm run db:seed`).

---

## Phases 6–22 — implementation (2026-10-04, Steps 5–20)

### Phase 6 — Badge models

```prisma
Badge { id, code @unique, name, description, icon?, category, createdAt, updatedAt }
UserBadge { id, userId → User (Cascade), badgeId → Badge (Cascade),
            earnedAt, @@unique([userId, badgeId]) }
```

`UNIQUE(userId, badgeId)` is the double-earn guard; the P2002 race path in
`badge.service.js:grantBadge` is the concurrent-request guard. `User.userBadges`
back-relation added. No badge writes via API in V1 (seed + evaluation only).

### Phase 7 — No Skill table

Confirmed by the audit: skills are `Attempt → Question → Subtopic → Topic`
aggregated on read (`profile.service.js:calculateSkills`). No `Skill` model.

### Phase 8 — Skill level rules (`profile.service.js`)

```text
solved < 10                    → fundamental (developing)
solved >= 10, accuracy < 50    → fundamental
solved >= 10, accuracy 50–75   → intermediate
solved >= 10, accuracy > 75    → advanced
```

`SKILL_MIN_SOLVED = 10`, `resolveSkillLevel(solved, accuracy)` exported for
tests. Boundaries covered in `test/profile.test.js` (50/75 → intermediate).

### Phase 9 — Profile repository (`profile.repository.js`)

Prisma-only, no math: `findUserWithProfile`, `findProfileByHandle`,
`createProfileForUser`, `updateProfileByUserId`, `upsertProfileForUser`,
plus raw derived fetchers (`findUserStats`, counts, `countQuestionsByDifficulty`,
`findAttemptsWithDifficulty`, `findPracticeHistory` with topic join,
`getUserDailyActivityCounts`, `findAttemptsWithTopics`,
`countQuestionsInSubtopic`, `findMostRecentActiveSession`).

### Phase 10 — Profile service (`profile.service.js`)

`getProfile` (User+Profile → DTO: handle/initials/memberSince/targetCompanies/
dailyQuestionGoal; never roleId/Google IDs) · `updateProfile` (allowlist +
handle 409 + legacy-row create fallback) · `clearAvatar` · `calculateStats`
(+byMode/+byDifficulty) · `calculateSkills` (+level) · `calculateHeatmap`
(+totalActiveDays/maxStreak) · `getHistory` (topic/duration/counts) ·
`getContinueSession` · `getRecommendations` (weakest-first).

### Phase 11 — `PATCH /api/v1/profile`

`authenticate → requirePermission("profile:update") → validate(zod) →
controller → service → repository`. `profile.validator.js` accepts only the 14
Profile columns (max lengths, URL checks, gender enum, 20-company cap,
goal 1–500); unknown keys are stripped by zod AND by the service allowlist, so
`userId/email/role` can never change here.

### Phase 12 — Avatar flow (V1)

URL-based, no raw image in Profile: `PATCH /profile { avatarUrl }` sets it,
`DELETE /profile/avatar` clears it (initials fallback). File upload path
(Frontend → object storage → URL → PATCH) is documented for later; no storage
is provisioned in this change.

### Phase 13 — Profile permissions

`profile:read` (existing) + `profile:update` (new). `USER` holds both (11
total), `ADMIN` holds all 23. Ownership stays structural: every profile route
uses `req.user.id`, no `/:userId` param exists.

### Phase 14 — Badges module

`apps/api/src/modules/badges/` (`badge.constants.js`, `badge.repository.js`,
`badge.service.js`, `badge.controller.js`, `badge.routes.js`).
`GET /api/v1/profile/badges` (mounted in `routes/index.js`) returns the full
catalog with `{ code, name, description, icon, category, earned, earnedAt }` —
the frontend never learns about `UserBadge` rows.

### Phase 15 — Badge seed

`BADGE_DEFINITIONS` (6 codes) upserted by `code` in `seed-authorization.js`
(`npm run db:seed` → `badges ok: 6`). Same no-delete policy as permissions.
Seed also drops the dead legacy-enum backfill (columns no longer exist) and
verifies `usersWithoutProfile` instead of `roleId: null`.

### Phase 16 — Achievement evaluation

`evaluateAchievements(userId)` called from `practice-session.service.js` after
attempt insert AND after session completion (covers FIRST_TEST/PERFECT_SESSION).
Synchronous, idempotent, never throws (badge failures can't fail practice).
No BullMQ in V1 — deliberate until latency data says otherwise.

### Phase 17 — Continue practice

`GET /api/v1/profile/continue` → most recent `completed=false` session with
`{ sessionId, topic, subtopic, mode, done, total, accuracy, startedAt }`
(`total` = curriculum questions in the subtopic). `null` when none. No table.

### Phase 18 — Practice history

`GET /profile/history` now returns `{ sessionId, topic, subtopic, mode,
questionsAttempted, correctAnswers, score, accuracy, durationMs, completedAt }`
(derived from session + attempts; `score` kept for compat).

### Phase 19 — Heatmap

`GET /profile/heatmap` → `{ days: [{date,count}], totalActiveDays, maxStreak }`.
No table. (Response shape changed from bare array → object; frontend heatmap
wiring must use `.days`.)

### Phase 20 — Recommendations

`GET /api/v1/profile/recommendations` → weakest-first
`[{ topic, accuracy, solved, reason }]` (`"Lowest accuracy"` first, then
`"Needs practice"`). No table.

### Phase 21 — Settings frontend (wired)

`apps/web/src/lib/api/profile.js` (apiFetch client for all 10 endpoints) +
`apps/web/src/app/(app)/settings/page.js` rewritten: `GET /profile` (+stats
for streak) for initial values → `PATCH /profile` on save → reload DTO into
state. `lib/mock/settings.js` no longer imported. Daily-goal row added
(`dailyQuestionGoal`); handle row is editable (409 surfaces in the banner).

### Phase 22 — Backend structure (as built)

```text
apps/api/src/modules/
├── auth/            (signup also creates Profile — Phase 3)
├── authorization/   (23 permissions; profile:update added)
├── profile/         (routes, controller, service, repository, validator)
├── badges/          (routes, controller, service, repository, constants)
├── practiceSession/ (attempt/complete → evaluateAchievements)
├── questions/ topics/ admin/ companySheets/
```

```text
User ─┬─ Profile (1-1)      Role ─ RolePermission ─ Permission
      ├─ AuthAccount         Badge ─ UserBadge (earned join)
      ├─ AuthSession
      ├─ PracticeSession
      └─ Attempt
```

### Verification (2026-10-04)

- `npx prisma validate` → valid; `db push` synced (Profile/Badge/UserBadge live).
- `npm run db:seed` → roles 2, permissions 23, USER 11 / ADMIN 23, badges 6.
- `npm test` → 36 pass (18 authorization + 18 profile/badges), incl. skill
  boundaries, handle 409, validator allowlist/strip, history/continue/heatmap/
  recommendations shapes, FIRST_SOLVE auto-grant + idempotency, RBAC.
- Step 19 (practice integrity `question.subtopicId === session.subtopicId`)
  was already enforced + tested; unchanged and still passing.
