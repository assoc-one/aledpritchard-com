@AGENTS.md

# aledpritchard.com — Project State

## Overview
Personal website for Aled Pritchard, Head of Design / Design Director.
Built in Next.js, deployed to aledpritchard.com via Vercel.

## Goals
1. Get employment
2. Consulting / fractional work
3. Advisory work
4. Coaching and mentoring
5. Thought leadership / podcast appearances

## Tech Stack
- Framework: Next.js
- Deployment: Vercel → aledpritchard.com
- Typography: Schibsted Grotesk
- AI integration: careerOS (progressive)
- WebGL (planned): Unicorn Studio for Mask Distortion hero mode

## Site Structure
Hero → Work → AI Feature → Writing → About → Contact/CTA → Footer

Sub-pages per section planned from the start via routing.

## Hero Interactions
Three modes built and iterated (v1–v12 prototypes):

### Tilting Table (current default/lead mode)
- 120 white balls on black canvas
- Mark is negative space (drawn black, invisible)
- Cursor position tilts a virtual table causing balls to roll
- Centre pull when idle
- Ball-to-ball collision
- Balls bounce off viewport edges
- Balls bounce off the invisible mark shape to reveal it
- Ball radius: ~3–7px (v12)

### Split & Drift
- Mark starts assembled, solid white
- Cursor contact causes three polygon pieces to fly apart
- Physics: bounce off viewport edges and each other
- Rotation on impact, direction based on contact angle
- Pieces retain drift/float after first interaction
- Static until first cursor contact

### Fluid Field
- Particle flow field, noise-based movement
- Cursor repulsion
- Mark sits solid white, elevated above the field

### Mask Distortion (parked)
- Concept: cursor as reveal mask over background image with chromatic aberration
- Canvas approach insufficient — needs WebGL shader quality
- To be implemented via Unicorn Studio embed

## Remix Toggle
- Dropdown selector centred in footer between "Head of Design | Design Director" and "2026"
- Cycles between hero interaction modes
- More modes can be added over time

## Mark / Symbol
- Personal geometric mark — triangular SVG with three interlocking polygon paths
- ViewBox: 238 × 207
- File: ASP.svg
- Three polygons (hardcoded as point arrays — SVG path parsing was unreliable):
  - Left lower: [[119.163,206.299],[81.0264,206.299],[59.582,169.155],[38.1367,206.299],[0,206.299],[59.582,103.1],[119.163,206.299]]
  - Upper: [[119.315,0],[100.247,33.0277],[121.692,70.1708],[78.8017,70.1712],[59.7334,103.199],[178.897,103.198],[119.315,0]]
  - Right lower: [[178.434,103.1],[197.502,136.128],[176.056,173.272],[218.947,173.272],[238.015,206.299],[118.851,206.299],[178.434,103.1]]

## Nav / Layout
- Top: AP (bold, top left) — Aled Pritchard (top right)
- Footer: Head of Design | Design Director (left) — Remix dropdown (centre) — 2026 (right)
- Black background, white type throughout

## Key Technical Learnings
- SVG path parsing unreliable — use hardcoded polygon point arrays
- Cross-origin getImageData() blocked on file:// — base64 encode images into HTML for local testing
- Mask distortion requires WebGL (Unicorn Studio) not canvas 2D pixel manipulation

## careerOS Integration
- AI portfolio chat interface (existing at aledpritchard.com)
- To be integrated progressively into new site
- AI Feature section: "Ask about my work" or role-fit tool
- Content syncs from Linear every 5 minutes

## Sections Status
| Section | Status | Notes |
|---------|--------|-------|
| Hero | In progress | Interaction modes prototyped, needs Next.js build |
| Work | Not started | Card grid, domain tags, data points |
| AI Feature | Not started | careerOS integration |
| Writing | Not started | Substack signpost + featured articles |
| About | Not started | Photo + narrative |
| Contact/CTA | Not started | Engagement types listed in footer |
| Footer | Not started | — |

## What Was Last Being Worked On
<!-- UPDATE THIS AT THE END OF EVERY SESSION -->
COS-195 (Project intro mode + text overview) — **shipped to production** (PRs #22 + #27). A new `intro` navigation state sits between a project's cover and slide 1, shown only when the project has editorial `overview` content (cover → intro → slide 1; projects without overview skip it, unchanged).
- **Schema:** optional `overview` object on `project` — title, subtitle, structured `{label, value}` meta, and a paragraph-only portable-text body. Absent → `overview: null` (backward compatible).
- **Nav/URL:** `intro` added to the `Mode` union; `hasOverview` on `ProjectMeta`. URL is `/work/[slug]/0` — intro as "slide 0" (Q1), via the existing `[n]` route; a `/0` hit on a project without overview 307-redirects to the cover.
- **Visual:** intro renders on the dark canvas (no cover image) with a subtle `#0e0e0e` fill panel in column 3; the project list + index counter stay visible. Built to Figma 119:3165.
- **First content:** JPMC overview ("Scaling design quality without scaling control"), authored from cOS.Content case studies.

## Outstanding / Next Up
<!-- UPDATE THIS AT THE END OF EVERY SESSION -->
- **Iteration 1 (COS-191) — complete.** All five features shipped: F1 narrow details column 480→320 (COS-192), F2 `fill` variant + `fit`→`fill` migration (COS-198/199), F3 frame hover-wake (COS-194), F4 intro mode (COS-195). F5 (video) was a decision only, parked for iteration 2.
- **Q9 (open):** only JPMC has an overview so far — add overviews for more projects in `/studio` and intro mode appears automatically per project.
- **Iteration 2 — video media (COS-222 → COS-223/224).** Now unblocked (F2 has shipped). Decision (COS-196 / T10) locked: host = **Mux** (`sanity-plugin-mux-input`, Studio-native upload); polymorphic `media` field (image | mux.video) on the slide schema; playback split by variant — `full`/`fill` autoplay+muted+loop+no-controls, `fit` no-autoplay+controls+16:9; poster frames on. Aled to provision Mux account + env creds (`MUX_TOKEN_ID`/`MUX_TOKEN_SECRET`) before T11. Key constraint: `VisualLayer.tsx` preloads ALL images as an always-mounted cross-fade stack; video must instead mount-on-active / pause+unmount off-active.

## File Structure
<!-- UPDATE THIS WHEN SIGNIFICANT FILES ARE ADDED -->

### Project intro mode (COS-195)
- `src/components/projects/ProjectOverview.tsx` — overview panel mounted in Frame's column 3; visible only in `intro` mode. `#0e0e0e` fill, 22px title, label/value meta strip, portable-text body (Figma 119:3165).
- `src/components/projects/WorkIntroStub.tsx` — client route stub for `/work/[slug]/0` → `goToIntroBySlug`.
- `src/app/(frame)/work/[slug]/[n]/page.tsx` — the `n=0` branch renders the intro (sr-only prose + stub) and redirects to the cover when the project has no overview.
- Touched: `overview` field in `src/sanity/schemas/project.ts`; `intro` mode + `hasOverview` + transitions in `src/lib/navigation.ts`; intro↔`/0` sync in `src/lib/routerSync.ts`; `intro` handling in `VisualLayer` / `CoverOverlay` / `ProjectList` / `IndexCounter`.
