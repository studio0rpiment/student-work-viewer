# Student Work Viewer — home for class work

This repo is where Kevin's class sites live: the student work viewers (showcases) and, through it, the assessments. Start class work here.

Live at https://gwdesign.kevinpatton.site (Vercel project `student-work-viewer`, repo `studio0rpiment/student-work-viewer`). Pushing to `main` deploys.

## Addresses

- `/`, `/classes`: the list of classes (no app title, just "classes")
- `/classes/<course>`: the course page, with code · term, title + term, a collapsible course description, showcases by due date, then links (e.g. the midterm)
- `/classes/<course>/<showcase>`: a gallery
- `/edit`: the admin (unlinked, password)

Courses are defined in `src/site.ts` (slug, code, title, term, description, links). A showcase belongs to a course by its `term` in Supabase; add a `course` column if two courses ever share a term.

## Assessments live in a second app

Forms and assessments are a separate Next.js app: `~/__DEV/assesment-form` (repo `studio0rpiment/assessment-forms`, Vercel `assessment-forms`). Questions are markdown files in its `forms/`, and responses go to Notion. That app serves everything under `/classes/experimental-tools-f26` (its `lib/base.ts`), and this repo's `vercel.json` forwards `…/midterm` plus its `_next` and `api` paths to it. Students only see this domain.

To add a form to a course:
1. Add the `.md` in the forms app.
2. Add its name to the forwarding rule in `vercel.json` and to the dev proxy in `vite.config.ts`.
3. Add a link in `src/site.ts`.

A new course with forms also needs its own base path in the forms app.

## Local development

`npm run dev` here (port 5173) plus `npm run dev` in the forms app (port 3000); Vite forwards the form paths to 3000.

## Style

KP Minimal (see `KP-MINIMAL.md`): two colours, monospace, 1px dashed and solid outlines, no fills, radius or boxed buttons. The forms app follows it too. Icons come from `~/__DEV/hand-icons-repo` (the course description triangle is `public/icons/triangle.svg`, used as a CSS mask). The loading state is a rotating 👓, light on dark.
