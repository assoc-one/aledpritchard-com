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
COS-196 (Video media support) / T10 decision (COS-207) — closed Done. Locked: host = **Mux** (via `sanity-plugin-mux-input`, Studio-native upload); polymorphic `media` field (image | mux.video) on the slide schema; playback split by variant — `full`/`fill` autoplay+muted+loop+no-controls, `fit` no-autoplay+controls+16:9; poster frames on. Pushed to **iteration 2** (after Feature 2's `fit`→`fill` variant migration). Implementation tickets drafted: COS-222 (T11 Mux+schema), COS-223 (T12 ambient `full`/`fill`), COS-224 (T13 framed `fit` player) — all Backlog, blocked by Feature 2.

Key constraint for implementers: `VisualLayer.tsx` preloads ALL images as an always-mounted cross-fade stack; video must instead mount-on-active / pause+unmount off-active.

## Outstanding / Next Up
<!-- UPDATE THIS AT THE END OF EVERY SESSION -->
- Iteration 1 (COS-191): Features 1–4 ready to build. Feature 2 (COS-198/199 variant rename+migration) is the production-data-risk item and gates video work.
- Iteration 2: COS-222 → COS-223/224 (video), once Feature 2 is Done. Aled to provision Mux account + env creds (`MUX_TOKEN_ID`/`MUX_TOKEN_SECRET`) before T11.

## File Structure
<!-- UPDATE THIS WHEN SIGNIFICANT FILES ARE ADDED -->
_[Claude Code: update this section when new components or pages are created]_
