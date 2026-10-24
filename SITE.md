# Student Work Viewer

Status as of 25 September 2026. Repo: `~/__DEV/__GW_PROJECTS/student-work-viewer` (GitHub `studio0rpiment/student-work-viewer`, Vercel project `student-work-viewer`), deployed on Vercel, data in Supabase. Design language: **KP Minimal**.

## Purpose

A place to show student work in class and keep it after. Each **showcase** is one assignment: a title, a due date and term, and a list of students, each with one site or a pair of sites (or images). The front page lists showcases in due-date order so it reads as the semester's progression. Clicking any piece opens it near-fullscreen, live and navigable, as a slide in a carousel that wraps through every student. The first showcase was "Slop vs. MCP + Skill" for CDES 3110/6110 Experimental Tools and Technology (two websites per student, due 22 September F26); the second is the knolling photographs (one image per student).

Everything is data-driven: a new assignment is a form, not a deploy. Editing happens at an unlinked URL behind a password. Nothing on the public pages points at the admin.

## Features

**Front page** (`/`) — course code and title from `src/site.ts`, then a dashed list of showcases with their due dates, earliest first.

**Gallery** (`/:slug`) — for site showcases, a responsive grid (five students across at 1920px) with each student's pair side by side, live thumbnails in dashed outlines, names in uppercase. For a single-image showcase it switches to a **flow** layout: images packed 5px apart with a skyline packer so there is no vertical slack between rows, every image's longest side equal (the `tile` size), names overlaid in the corner. Hover a tile for **rotate**; **+ / −** under the theme icon resize all tiles. Both animate with the View Transitions API so neighbours slide out of the way. Anyone can rotate or resize for their visit; a signed-in admin's change is saved.

**Carousel** — opened by clicking any card. The site is fully interactive (scrolls, clicks). Move with the outer 5% click zones on either edge, ← →, or a two-finger horizontal swipe over the margins; wraps at both ends. Click outside or Esc to return. Caption shows student, variant label and an "open ↗" link. Images honour their saved rotation and are letterboxed.

**Theme** — dark by default (#111613 on #FFF7E6), light flips them; a bare outline moon/sun icon top right. Always starts dark; nothing persisted.

**Admin** (`/edit`, `/edit/new`, `/edit/:slug`) — password sign-in for one fixed account. Index lists all showcases. New-showcase form: title, slug, one site or a pair, caption(s), due date, term. Editor: every field saves on blur/Enter (Escape reverts); rows have ↑ ↓ ×, "+ add", and "+ add from images" which takes a folder of files and makes a row per file named from the filename, uploading each. Each URL field has an "upload" button. "delete this showcase" at the bottom with an inline two-step confirm.

**Images** — any URL ending in an image extension renders as `<img>` rather than an iframe. Uploads go to a public Supabase Storage bucket (`uploads/<showcase-slug>/…`, 10 MB cap, images only). iPhone HEIC files must be converted to real JPEGs first — browsers other than Safari won't render HEIC, and a `.jpg` extension on a HEIC file shows blank.

**claude.ai artifacts** can't be iframed; save the artifact's HTML into `public/sites/` and link `/sites/<name>.html`.

## Design system — KP Minimal

Two colors per theme, everything derived: `--bg`, `--line`, `--muted` = line mixed 55% into bg, overlays = bg at 92%. Type is the system monospace stack (ui-monospace / SF Mono), body 0.8rem, labels 0.75rem lowercase with 0.04em tracking, names 0.9rem uppercase with 0.08em tracking; all sizing in rem. Line: 1px outlines only, no fills, shadows or radius — dashed for things waiting to be picked (cards, inputs at rest), solid when active, hovered or focused. Inputs are a bottom rule. Controls are text or 1.5px outline icons, muted at rest, never boxed; navigation prefers edge zones, gestures and keys over visible chrome, and controls disappear when a view takes over. Layout is `auto-fill` grids or packed tiles with generous gaps between groups and 5px between images. Behaviour is event-driven: save on blur, resize via ResizeObserver, no polling; the one timer (swipe gesture idle detection) is commented as such. Full write-up in `KP-MINIMAL.md`.

## Technical stack

Vite 5 + React 18 + TypeScript, no UI library, no router library (a 30-line path router in `hooks/useRoute.ts`). Supabase for Postgres (tables `showcases`, `entries`, `admins`), auth (password sign-in for one account; magic link removed because the built-in mailer is rate-limited), and Storage (bucket `uploads`). Row Level Security: anyone can read; writes require `is_admin()`, which looks the session's user up in `auth.users` and matches the email against `admins`. `supabase/schema.sql` is the whole schema and is re-runnable (every statement is `if not exists` / `or replace`, with additive `alter table` migrations). Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` in `.env.local` and Vercel; without them the app runs read-only from `src/data/students.json`. `vercel.json` rewrites deep links to the app except `/sites/*`.

Key modules: `lib/data.ts` (the only file that talks to Supabase; JSON fallback), `lib/storage.ts` (uploads), `lib/skyline.ts` (packer), `types.ts` (Showcase, Entry, Slide, `toSlides`, `formatDue`, `isImage`), `themes.ts`, `site.ts` (app name, course). Components are small and composable: `Gallery` → `StudentGroup` → `Card` → `Media` → `SiteFrame` | `ImageFrame`; `ImageFlow` → `ImageTile`; `Carousel`, `Overlay`, `SlideCaption`; editor pieces `Field`, `EntryRow`, `UploadButton`, `BulkImport`, `SlotsPicker`, `ConfirmButton`, `ScaleControl`; `Toolbar`, `ThemeToggle`, `Icon`, `Label`. Hooks: `useRoute`, `useTheme`, `useSession`, `useShowcase`, `useSwipe`, `useImageRatio`.

Browser notes learned the hard way: cross-origin iframes swallow wheel and key events, so swipe only works over margins (or inside same-origin local copies, which forward it); `overscroll-behavior-x: none` stops macOS turning the swipe into browser back; a cached image can finish loading before React attaches `onLoad`, so orientation is also measured on mount; browsers apply EXIF rotation before reporting `naturalWidth/Height`, so portrait phone photos come out right.

## Operational notes

Supabase free tier limits are per organisation (roughly 1 GB storage, 500 MB database, 5 GB/month egress) and free projects pause after a week without API traffic; class visits keep it awake during the semester. Schema changes so far, all in `schema.sql`: `due_date`, `term`, `slots`, `tile` on showcases; `rot_a`, `rot_b` on entries; the `uploads` bucket and its policies.
