# Authorization — Behavior Freeze (pre-permission-system)

Date: 2026-10-03. Nothing below has been changed; this is the baseline the
permission subsystem must preserve while it is introduced in stages.

## Roles (Prisma enum `Role`)

- `USER`, `ADMIN`. Assigned out-of-band (direct DB); no API reads or changes roles.

## Endpoint inventory (33 total)

### Public (no authentication)

| Method | Path | Note |
|---|---|---|
| GET | `/api/v1/health` | infra check |
| GET | `/api/v1/auth/google` | starts OAuth, sets `oauth_state` cookie |
| GET | `/api/v1/auth/google/callback` | CSRF-protected by state cookie, NOT by login |

### Authenticated only (Bearer access token, no permission, no ownership)

| Method | Path | Note |
|---|---|---|
| POST | `/api/v1/auth/refresh` | refresh cookie |
| POST | `/api/v1/auth/logout` | refresh cookie |
| GET | `/api/v1/auth/me` | self |
| GET | `/api/v1/topic/` | full list |
| GET | `/api/v1/topic/sheets` | sheet metadata + questionCount |
| GET | `/api/v1/topic/:id/subtopics` | no answer data |
| GET | `/api/v1/question/?subtopicId=` | no solution / isCorrect |
| GET | `/api/v1/question/:questionId` | no solution / isCorrect |
| POST | `/api/v1/practice-session/` | creates for `req.user.id` |
| GET | `/api/v1/profile/` (+ `/stats` `/history` `/heatmap` `/skills`) | always `req.user.id`, no `:id` param |

### Authenticated + ownership (service-level `session.userId === req.user.id` → 403)

| Method | Path |
|---|---|
| GET | `/api/v1/practice-session/:id` (also requires `completed`) |
| POST | `/api/v1/practice-session/:id/attempts` (also requires active session, no duplicate) |
| PATCH | `/api/v1/practice-session/:id/complete` (also requires active session) |
| GET | `/api/v1/practice-session/:id/results` (also requires `completedAt`) |

### Admin / content-protected (`authenticate` + `authorize("ADMIN")`)

`POST/PATCH/DELETE /api/v1/admin/topics`, `/subtopics`, `/questions` (9) and
`POST/PATCH/DELETE /api/v1/admin/sheets/` (3). Sheet create/update nests
`questionIds` composition — no standalone linking API.

### No API surface (do NOT design permissions for these yet)

- `Discussion/Comment/Reply/DiscussionLike` — Prisma models only, zero routes.
- User management (list/ban/change-role) — does not exist.
- Profile update — does not exist (GETs only).

## Recorded bug: cross-subtopic attempt injection

`submitAttemptService` verifies `option.questionId === questionId` and session
ownership, but never verifies the question belongs to the session's subtopic:

```text
PracticeSession { subtopicId: A } + Attempt { questionId: <from subtopic B> }
```

is currently accepted. Target invariant:

```text
attempt.question.subtopicId === attempt.session.subtopicId
```

enforced at attempt-creation time (Phase 18), kept atomic with the insert.

---

# Final state (post-implementation)

## Request pipeline

```text
authenticate()              who is this? loads user + role per request
requirePermission(name)     capability check via authorization.service
requirePracticeSessionOwnership (practice :id routes)  404 / 403, attaches session
validate()                  zod business-shape validation
controller → service → repository → PostgreSQL
```

## Models

`User.roleId → Role → RolePermission → Permission`. The old `Role` enum is
gone (migrated via rename → seed → backfill → drop; verified with 0 orphaned
users). `RolePermission` uses `@@id([roleId, permissionId])` — duplicates are
impossible. Seed never deletes assignments; revocation is a separate migration.

## Permission vocabulary

Single source: `src/modules/authorization/authorization.constants.js`
(22 permissions). `USER` holds 10 (reads + own practice/profile);
`ADMIN` holds all 22. `profile:update`, `users:*`, `discussions:*` do not
exist because those APIs do not exist.

## JWT decision (Phase 8)

Payload stays `{ id, email }` — role is loaded from the DB on every request
inside `authenticate()`, so role changes apply immediately. No `sessionId`
in the token (unneeded: revocation lives in `AuthSession`, checked on
refresh). Revisit with Redis caching only if permission lookups show up in
profiles.

## Attempt validation order (service, defense in depth behind middleware)

1. option exists → 2. option.questionId matches → 3. session exists →
4. question exists AND `question.subtopicId === session.subtopicId` (the
recorded bug, now closed) → 5. ownership → 6. session active →
7. no duplicate (unique key P2002 as final guard) → 8. single-row insert
(no transaction warranted for one write).

## Error contract

- 401 `Authentication required` / missing session token (no permission check ran).
- 403 `Insufficient permissions` (permission gate) or the pre-existing
ownership messages (`Access Denied: You do not own this session`).
- The missing permission NAME is logged server-side only, never sent to clients.

## Denial logging

`AUTHORIZATION_DENIED` JSON lines on the backend console:
`{ event, userId, role, permission, method, route }`. No tokens. No log line
on success (noise).

## Role assignment (current policy)

Out-of-band controlled DB operation, e.g.:

```sql
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'ADMIN')
WHERE email = '...';
```

Document who/when for each grant. Build `/admin/users` (`users:read`,
`users:update-role` + audit trail) only when the product needs it.

## Verification

- `npm run db:seed` — idempotent seed + backfill + counts (fails non-zero if
any user lacks `roleId`).
- `npm test` — 18 tests (catalog consistency, allow/deny matrix, middleware
401/403/404, ownership, cross-subtopic 400, option integrity, duplicates,
session state). DB-backed with unique fixtures, self-cleaning.
- Live boot checks performed: USER 403 on all 4 write resources, 200 on
reads/profile, 404 on missing session, 401 without token, ADMIN passes gates
to validation (400 on empty body, nothing created).
