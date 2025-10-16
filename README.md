# Numerology Pro

Production-ready Next.js app for numerology analysis: Thai numerology, Chinese Wu Xing elements, and basic Western sums for phone numbers and Thai license plates.

## Quick Start

- Install: `pnpm i`
- Dev: `pnpm dev` then open http://localhost:3000
- Tests: `pnpm test`

No server-side environment variables required.

## Tech Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- i18n via next-intl (default: th, alt: en)
- React Hook Form + Zod validation
- Icons: lucide-react
- State: React hooks
- PWA: next-pwa (offline cache for static + last results)
- PDF Export: server-side via PDFKit (`/api/pdf`)
- Testing: Vitest + React Testing Library
- Lint/Format: ESLint + Prettier

## How It Works (Scoring Transparency)

- PairScore: Each overlapping pair (e.g., 0812 -> 08, 81, 12) is looked up in `/data/pairs.json`. Positive pairs weigh +2; caution pairs weigh −2 by default (tunable in `/data/config.json`).
- SumScore: Total sum of digits computed and mapped to Western ranges (eloquence, drive, stability, fortune, harmony, attraction) from `/data/config.json`.
- ElementScore: Wu Xing elements tallied across the number. If supportive elements meet a threshold (`elementBonusThreshold`), a small bonus is applied (`elementBonus`).
- Final Grade: A/B/C from the combined score. The “why” is listed in the rules, highlighting which components contributed.

## Features

- Phone and Plate tabs with localized forms and validation
- Thai plate letter scoring using `/data/thaiLetterMap.json` (edit indices; values are digital roots)
- Chinese Wu Xing distribution with a simple radar SVG
- Suggestions: Top ending pairs based on supportive elements and positive pairs
- Save last 5 analyses in `localStorage`
- Deep links via query params: `?mode=phone&n=0812345678&dob=1990-09-09&lang=th`
- Export PDF (server route) and copy share link
- Dark mode + language switch
- CSP headers and disabled x-powered-by

## Project Structure

- `app/` App Router pages and API routes
- `components/` UI components
- `lib/` Pure TS utilities for numerology logic
- `data/` Editable JSON for mappings and weights
- `tests/` Unit/UI tests with Vitest
- `public/` PWA manifest and icons

## Development Notes

- PWA is disabled in development; enabled in production.
- The PDF route uses Node runtime with PDFKit; it doesn’t store any PII.
- All analysis is client-side. Only export PDF touches the server route at request time.

## Deployment

- Ready for Vercel. Includes `vercel.json` and CSP in `next.config.mjs`.

## Accessibility

- Semantic HTML, visible focus styles, keyboard navigable, WCAG-AA mindful colors.

## Internationalization

- Default Thai (`th`), alternate English (`en`). Language toggled via header button; stored in cookie `lang`.

## Scripts

- `pnpm dev` — Run locally
- `pnpm build` — Build
- `pnpm start` — Start production
- `pnpm test` — Run tests
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript
