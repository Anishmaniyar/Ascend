# LeetAptitude — Frontend

Next.js (App Router) + Tailwind CSS v4 frontend for the LeetAptitude aptitude
preparation platform, styled with the **Ventriloc** design system
(warm paper canvas, monospace-precision data cards, a single ember-orange
accent) in both **light and dark mode**.

---

## Stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 15 (App Router)                  |
| Language   | JavaScript (ESM)                         |
| Styling    | Tailwind CSS v4 + CSS custom properties  |
| Fonts      | Inter (body) · Inter Tight (display, PolySans substitute) |

---

## Getting started

```bash
cd frontend
npm install

# 1. copy the env example
cp .env.example .env.local      # adjust NEXT_PUBLIC_API_URL if needed

# 2. run the backend first (port 3000), then:
npm run dev                     # frontend on http://localhost:3001
```

- Frontend dev server: **http://localhost:3001** (port 3001 avoids clashing
  with the Express backend on 3000).
- Backend API base: `NEXT_PUBLIC_API_URL` (default `http://localhost:3000/api/v1`).
- Auth: the backend accepts a JWT via `Authorization: Bearer <token>` (or a
  `token` cookie). Store the token returned by `/auth/login` and attach it
  to every request — the `src/lib/api/` client is where this lives.

---

## 🎨 Theme system (read this first)

The entire design language is driven by **semantic CSS tokens** defined in one
file: [`src/app/globals.css`](src/app/globals.css). Components never hard-code
colors or fonts — they use tokens, so **re-theming the whole app is a
one-file edit**.

### The three layers

1. **`--palette-*`** — raw hex values from the style guide (the reference).
2. **`--color-*` / `--font-*`** — semantic tokens consumed by everything.
   - `:root { … }` = **light mode** values.
   - `.dark { … }` = **dark mode** values (same token names, flipped values).
3. **Tailwind `@theme` mapping** — generates utilities from the tokens:
   `bg-ash`, `text-graphite`, `font-polysans`, `text-display`,
   `rounded-asymmetric`, …

### Changing the theme

| I want to…                                   | I edit…                                          |
| -------------------------------------------- | ------------------------------------------------ |
| Change a light-mode color                    | the `--color-*` value in `:root`                 |
| Change a dark-mode color                     | the `--color-*` value in `.dark`                 |
| Swap the display font (e.g. real PolySans)   | `--font-display` in `:root` + `src/app/layout.js` |
| Add a color                                  | a `--color-*` in `:root`/`.dark` + a line in `@theme inline` |
| Tune radii / type scale                      | the `@theme` block (radius + text tokens)        |

### Token → utility cheat sheet

| Token               | Utility (examples)                 | Role                          |
| ------------------- | ---------------------------------- | ----------------------------- |
| `--color-graphite`  | `text-graphite` `bg-graphite`      | primary text / fills          |
| `--color-canvas`    | `bg-canvas`                        | page background               |
| `--color-ash`       | `bg-ash`                           | cards & section surfaces      |
| `--color-fog`       | `bg-fog`                           | nested surfaces               |
| `--color-ivory`     | `bg-ivory`                         | featured warm blocks          |
| `--color-steel`     | `text-steel`                       | secondary body copy           |
| `--color-slate`     | `text-slate`                       | muted text                    |
| `--color-mist`      | `border-mist`                      | hairline borders              |
| `--color-ember`     | `text-ember` `border-ember`        | accent (links, highlights)    |
| `--color-brass`     | `text-brass`                       | charts, tags                  |
| `--color-inverse`   | `text-inverse`                     | text on graphite fills        |
| `--color-success` / `--color-danger` | `text-success` `bg-danger` | app feedback states (extension) |
| `--font-polysans` / `--font-inter` | `font-polysans` `font-inter` | display / body fonts      |
| `--text-display` … `--text-caption` | `text-display` `text-heading` `text-caption` | type scale |
| `--radius-*`        | `rounded-asymmetric` (alias `rounded-asymmetric-card`) `rounded-nav-pills` `rounded-buttons` | shape system |

**Design rules baked into the base layer:**

- Headings render in the display font at **weight 400** with `-0.02em`
  tracking — never bold the display type.
- Buttons use `font-polysans` labels.
- `::selection` and `:focus-visible` use ember orange.
- Dark mode flips `color-scheme` too (native form controls & scrollbars).

### Dark mode mechanics

- `ThemeToggle` (`src/components/ui/ThemeToggle.js`) toggles the `.dark`
  class on `<html>` and persists the choice to `localStorage`.
- `src/app/layout.js` runs an inline script **before first paint** that reads
  `localStorage` (falling back to the OS `prefers-color-scheme`), so there is
  no flash of the wrong theme.
- `dark:` variants are available for per-component differences
  (`dark:bg-canvas`), but most components won't need them — the semantic
  tokens flip automatically.

### Notes & deliberate deviations

- `--color-success` / `--color-danger` (muted green/red) extend the
  "two-warm-accent" rule for quiz correct/incorrect feedback — they are the
  only chromatic tokens beyond ember/brass, and only for app states, never
  marketing surfaces.
- Style-guide aliases omitted because Tailwind already provides equivalents:
  `--font-weight-*` → `font-normal/medium/semibold`, `--leading-*` →
  `leading-*` utilities, `--surface-*` → the `--color-*` tokens above.
- ESLint is not wired up yet (kept the scaffold minimal) — add
  `eslint` + `eslint-config-next` when you start building components.

---

## Folder structure

```
frontend/
├── src/
│   ├── app/                        # App Router — routes live here
│   │   ├── (marketing)/            #   landing page + marketing sections (built)
│   │   ├── (auth)/                 #   login / register (shared auth layout)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (app)/                  #   authenticated app shell (sidebar layout) — built
│   │   │   ├── dashboard/          #     built (welcome, stats, heatmap, skills…)
│   │   │   ├── topics/  sheets/  practice-history/  discussions/  profile/   #   built with dummy data
│   │   ├── admin/                  #   admin panel (role-gated)
│   │   │   ├── topics/  subtopics/  questions/  sheets/
│   │   ├── layout.js               #   root layout — fonts + theme bootstrap
│   │   ├── page.js                 #   (landing lives in (marketing)/page.js)
│   │   ├── globals.css             #   🎨 THE THEME — tokens for light & dark
│   │   └── icon.svg                #   favicon
│   ├── components/
│   │   ├── ui/                     #   Button, Card, Input, Tag, Skeleton…
│   │   │   └── ThemeToggle.js      #   (already implemented)
│   │   ├── layout/                 #   Header, Footer, NavPill
│   │   ├── charts/                 #   LineChart, RingProgress, Heatmap, StatCard
│   │   └── forms/                  #   form fields, validation helpers
│   ├── context/                    #   AuthProvider, ThemeProvider
│   ├── hooks/                      #   useAuth, useLocalStorage, useFetch…
│   └── lib/
│       ├── api/                    #   client.js (fetch wrapper + token),
│       │                           #   endpoints.js (typed route map)
│       └── auth/                   #   token storage, route guards
├── public/                         # static assets
├── .env.example                    # env vars (copy to .env.local)
├── jsconfig.json                   # @/* → src/* path alias
└── package.json
```

> Folders are empty (`.gitkeep`) — they define the intended architecture.
> Route groups `(marketing)` / `(auth)` / `(app)` will each get their own
> shared `layout.js` as you build them.

---

## Backend API map (for building the `src/lib/api` layer)

| Endpoint                                        | Auth | Purpose                      |
| ----------------------------------------------- | ---- | ---------------------------- |
| `POST /auth/register` · `POST /auth/login`      | –    | body shape `{ data: {...} }` |
| `GET /auth/me`                                  | ✅   | current user                 |
| `GET /topic` · `GET /topic/sheets`              | –    | topics, company sheets       |
| `GET /topic/:topicId/subtopics`                 | –    | subtopics per topic          |
| `GET /question?subtopicId=` · `GET /question/:id` | –  | questions                    |
| `POST /practice-session`                        | ✅   | start session (`{subtopicId, mode}`) |
| `GET/POST/PATCH /practice-session/:id…`         | ✅   | attempts, complete, results  |
| `GET /profile/*` (stats, history, heatmap, skills) | ✅ | analytics                    |
| `POST/PATCH/DELETE /admin/*`                    | ✅ admin | manage topics/subtopics/questions |
| `POST/PATCH/DELETE /admin/sheets`               | ✅ admin | manage company sheets        |
