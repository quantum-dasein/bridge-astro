# bridgeconsult.uz — Astro sections

The Astro part of [Bridge Consult](https://www.bridgeconsult.uz) — an
Uzbekistan-based consultancy for FIDIC contracts, claims and MDB-funded
infrastructure projects.

This repository holds the sections that were rebuilt as a static Astro site:
the news desk, the Academy and Contract Support landing pages, and the project
case pages. Everything here is trilingual — **Russian, English, Uzbek** — and
ships as pre-rendered HTML.

> The site's original hand-written pages have not been ported yet — the home
> page among them. They are served as-is from `public/` (`index.html`,
> `main.js`), so this repository is the whole domain, half of it migrated.

---

## Sections

| Route | Source | What it is |
|---|---|---|
| `/news/`, `/news/en/`, `/news/uz/` | `src/pages/news/`, `src/content/news/` | The news desk — 10 articles × 3 languages as MDX, with related-article links and optimised imagery |
| `/academy/` (+ `/en/`, `/uz/`) | `src/pages/academy/`, `src/data/academy.*.ts` | FIDIC training programmes and the application form |
| `/contract-support/` (+ `/en/`, `/uz/`) | `src/pages/contract-support/`, `src/data/offer.*.ts` | The contract-support offer, per language |
| `/projects/[slug]/` (+ `/EN/`, `/UZ/`) | `src/pages/projects/`, `src/data/projectCases.ts` | Project case pages |
| `/api/news.json` | `src/pages/api/news.json.ts` | The news feed, for the legacy pages that still need it |

Copy lives in `src/data/*.{ru,en,uz}.ts` and `src/content/news/*.mdx`, one file
per language, so a translation is a file rather than a branch in a template.

## Serverless functions

Two Vercel Edge functions sit outside the Astro build in `api/`:

- **`api/chat.js`** — a same-origin proxy to the Anthropic API for the site
  assistant. The key lives only in `ANTHROPIC_API_KEY` on Vercel and never
  reaches the browser; the function streams the SSE response straight back, so
  the front-end keeps its streaming UI. Origin-checked against the site's own
  domains.
- **`api/apply.js`** — application forms from the Academy, Contract Support and
  Summer School pages. Each submission goes to Telegram, and to email via
  Formspree when `FORMSPREE_ID` is set. Bot token in the environment only.

| Variable | Used by | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | `api/chat.js` | for the assistant |
| `TELEGRAM_BOT_TOKEN` | `api/apply.js` | for form delivery |
| `TELEGRAM_CHAT_IDS` | `api/apply.js` | comma-separated recipient ids |
| `FORMSPREE_ID` | `api/apply.js` | optional email copy |

Telegram will not let a bot message someone who has never pressed Start on it.
A recipient in `TELEGRAM_CHAT_IDS` who has not done so returns `chat not found`
— that is the recipient's state, not a bug in the function.

## Running it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # → ./dist  (regenerates the sitemap first)
npm run preview
```

Node 22.12+.

| Command | What it does |
|---|---|
| `npm run sitemap` | Regenerates `public/sitemap.xml` from the news content and project data. Runs automatically on `prebuild`. |
| `npm run assets:images` | Re-encodes news imagery to the sizes the cards and articles request |
| `npm run build:tw` | Rebuilds the standalone Tailwind bundle the legacy pages load as `/tw.css` |

## Stack

[Astro 6](https://astro.build) · MDX content collections · Tailwind CSS 4 ·
[AOS](https://michalsnik.github.io/aos/) for scroll reveals · Vercel Edge
functions · deployed on Vercel.

No client framework: the pages are HTML, and the only JavaScript that ships is
the scroll-reveal library, the assistant widget and the form handlers.
