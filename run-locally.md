# Running Locally

This guide provides instructions to run the project locally.

## Backend Setup and Run

The FastAPI backend is managed with `uv`. 

```bash
cd app/api
uv run uvicorn app.main:app --reload
```

## Frontend Setup and Run

The Next.js frontend is managed with `pnpm`.

```bash
cd apps/web
pnpm install
pnpm dev
```
