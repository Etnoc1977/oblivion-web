# Oblivion Web Portal

Dark-themed admin dashboard, user portal, and public verification page for the Oblivion platform.

## Quick Start

```bash
cd C:\OblivionWeb
npm install
copy .env.example .env.local
npm run dev
```

Open http://localhost:3001 (Next.js will pick the next available port if 3000 is taken by the API).

## Pages

| Page | URL | Auth | Description |
|------|-----|------|-------------|
| Login | /login | No | Sign in / Register |
| Admin Dashboard | /admin | Admin | Stats, charts, user list, revenue |
| My Deletions | /dashboard | Yes | User's deletion history with details |
| API Keys | /api-keys | Yes | Create, view, revoke API keys |
| Plans & Billing | /checkout | Yes | Plan comparison, Stripe activation |
| Verify Deletion | /verify | No | Public verification by transaction ID |

## Requirements

- Node.js 18+
- Oblivion API running on http://localhost:3000

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS (dark theme)
- Recharts (charts)
- Lucide React (icons)
