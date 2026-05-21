# aledpritchard.com

Personal website for Aled Pritchard. Built with Next.js 16 (App Router) and TypeScript, styled with Tailwind CSS v4, content-managed through an embedded Sanity Studio, transactional email via Resend, and deployed on Vercel. Content editors use the Studio at `/studio`; the site reads published content through the Sanity Content Lake.

## Stack

- **Next.js 16** — App Router, React 19, Turbopack
- **TypeScript**
- **Tailwind CSS v4**
- **Sanity** — embedded Studio at `/studio`, dataset `production`
- **Resend** — transactional email (used from COS-142 onwards)
- **Vercel** — hosting; pushes to `main` deploy to production

## Prerequisites

- Node.js 20+ (developed on v24)
- npm
- Accounts/access for Sanity and Vercel (request from Aled)

## Local setup

```bash
git clone https://github.com/aledpritchard-design/aledpritchard-com.git
cd aledpritchard-com
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev
```

The site runs at http://localhost:3000 and the Sanity Studio at http://localhost:3000/studio.

## Environment variables

Copy `.env.example` to `.env.local` and fill in each value. `.env.local` is gitignored and must never be committed.

| Variable | Description | Where to find it |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | Sanity dashboard → Project settings |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name (`production`) | Fixed value |
| `SANITY_API_READ_TOKEN` | Sanity read token (Viewer permission) | manage.sanity.io → API → Tokens |
| `RESEND_API_KEY` | Resend API key for transactional email | resend.com → API Keys |

The same variables are configured in the Vercel project (Development, Preview, Production scopes).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Deployment

The repo is connected to Vercel. Every push to `main` triggers a production deploy; pushes to other branches create preview deploys. Environment variables are managed in the Vercel dashboard.

## Design reference

`careeros-web-prototype-v4.html` at the repo root is a single-file design prototype. It validates the design model and is a visual reference only — not a code reference.
