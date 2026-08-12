# Running Locally

This guide provides instructions to run the project locally.

## Backend Setup and Run

The FastAPI backend is managed with `uv`. 

```bash
cd apps/api
cp .env.example .env
uv run uvicorn app.main:app --reload
```

## Frontend Setup and Run

The Next.js 16.3 frontend is managed through the root `pnpm` + Turborepo workspace.

```bash
pnpm install
cp apps/web/.env.local.example apps/web/.env.local
pnpm dev
```

Set `API_URL` in `apps/web/.env.local` to the backend URL. `API_URL` stays server-only so the HttpOnly-cookie session can be used during SSR.
