# Content Guide — adding your real values

All app pages now read from the backend. This guide shows how to put YOUR
content in. Base URL for everything below: `http://localhost:5000/api/v1`.

## 0. Prerequisites

- API + DB running, `npm run db:seed` done (roles, 31 permissions, 6 badges).
- You are logged in via Google in the browser.

### Getting a Bearer token (for curl / Postman)

1. Log in at `http://localhost:3001`, open DevTools → Application → Cookies.
2. The `refresh_token` cookie is httpOnly (not readable via JS) — instead call:
   `POST http://localhost:5000/api/v1/auth/refresh` with cookies included
   (Postman: enable cookies; curl: reuse the cookie jar from the callback).
3. Copy `data.accessToken` → header `Authorization: Bearer <token>`.

### Becoming ADMIN (one-time, direct DB)

```sql
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'ADMIN')
WHERE email = 'you@example.com';
```

Log out + back in afterwards (role is loaded per request from the access
token's user — a fresh token picks it up).

## 1. Topics

```http
POST /admin/topics                    (topics:create)
{ "title": "Quantitative Aptitude", "description": "Numbers, ..." }
```
Title ≥ 10 chars, description 10–1000 chars. Returns `{ id, ... }` — keep the
id for subtopics. List: `GET /topic/`.

## 2. Subtopics

```http
POST /admin/subtopics                 (subtopics:create)
{ "title": "Profit & Loss ...", "description": "...", "topicId": "<uuid>" }
```
Title ≥ 10 chars. List per topic: `GET /topic/:id/subtopics`.

## 3. Questions (+ options)

```http
POST /admin/questions                  (questions:create)
{
  "title": "A shopkeeper buys ...?",
  "difficulty": "EASY",
  "type": "MCQ",
  "solution": "SP = ...",
  "subtopicId": "<uuid>",
  "options": [
    { "text": "20%", "isCorrect": true },
    { "text": "25%", "isCorrect": false }
  ]
}
```
Difficulty is `EASY | MEDIUM | HARD`, type `MCQ | NUMERIC`, ≥ 2 options.
Exactly how many `isCorrect` you mark is your call (usually one).
Reads: `GET /question/?subtopicId=<uuid>` (no answers leak).

## 4. Company sheets

```http
POST /admin/sheets                     (sheets:create)
{
  "title": "TCS Aptitude Set 1",
  "description": "Quantitative, Logical & Verbal",
  "companyName": "TCS",
  "difficulty": "MEDIUM",
  "estimatedTime": "0:30",
  "questionIds": ["<uuid>", "<uuid>"]
}
```
`estimatedTime` is `H:MM` (`"1:00"`, `"0:45"`). Questions can repeat across
sheets. Reads: `GET /topic/sheets`, `GET /topic/sheets/:id/questions`.
Sheet practice sessions bind to the sheet (cross-subtopic attempts allowed
only inside mapped questions).

## 5. Contests

```http
POST /admin/contests                   (contests:create)
{
  "title": "Weekly Aptitude Sprint",
  "description": "All topics, 60 minutes",
  "type": "WEEKLY",
  "startsAt": "2026-10-12T09:00:00Z",
  "endsAt": "2026-10-12T10:00:00Z",
  "durationMin": 60,
  "totalQuestions": 30
}
```
`type` is `WEEKLY | COMPANY` (+ optional `company`, `difficulty`).
Status (upcoming/live/ended) derives from the clock. Users register from the
contests page. Live contest-taking + per-contest scoring is the next feature
(see `docs/profile-data-design.md`).

## 6. Discussions

Any logged-in user, no admin needed:

```http
POST /discussions                       (discussions:create)
{ "title": "How to solve probability faster?", "content": "...", "tag": "Probability" }
```

## 7. Badges

Fixed catalog in `src/modules/badges/badge.constants.js` (6 codes), seeded
by `npm run db:seed`. Earned automatically by practice activity — nothing to
insert by hand. Adding a new badge = add a definition + an evaluation rule in
`badge.service.js` + reseed.

## 8. Your own profile content

Display name, bio, links, target companies, daily goal: edit from
`/settings` (PATCH /profile). Your stats, heatmap, skills, badges and history
derive from practice activity — solve questions and they fill in.

## Order that works

Topics → Subtopics → Questions → (Sheets, Contests) → practice in the app →
verify on dashboard / profile / progress / leaderboard.
