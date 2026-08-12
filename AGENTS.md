# AGENTS.md — Agent Guide

> **This document is the authoritative source of truth for this repository.**
> When any convention here conflicts with another document (including `README.md`,
> inline comments, or code), **this file wins**. If you change how the repository is
> structured, built, or run, you **must update this file in the same change**.

This is a **generic, reusable full-stack monorepo template**. It is meant to be cloned
as the starting point for new, unrelated projects. It ships **scaffolding, tooling,
documentation, and minimal working examples** — never project-specific business logic.
Read this guide fully before making changes, and follow it on every task.

---

## 1. Purpose

This template gives you a typed, conventional starting point for a full-stack project:

- A typed **Python backend** (FastAPI, managed with `uv`) at `apps/api`.
- A typed **TypeScript frontend** (Next.js 16.3 App Router and Server Components,
  managed with `pnpm`) at `apps/web`.
- A reserved **shared package** placeholder at `packages/shared`.

The goal is to let a Developer (human or AI agent) start building immediately with all
static checks passing from the first clone. Everything is typed end to end: Python uses
full type hints checked by `ty`; TypeScript runs in strict mode checked by `tsc --noEmit`.

The template stays **small, flat, explicit, and generic**. It is production-ready without
being enterprise-heavy. Example code uses placeholder names (an `Item` resource with an
`id` and a `name`) and carries no domain meaning, so it can be cloned into any project
without inheriting anything that must be deleted.

> **No testing setup — by design.** This template intentionally has **no testing setup**.
> Tests are **not required**, and **no test runner, test framework, or test scaffolding**
> is provided by default. Do not add one as part of routine work. Correctness is verified
> through the static checks described in [§8](#8-type-checking--linting). See
> [§14](#14-prohibited-actions).

---

## 2. Repository Map

The repository has exactly two top-level code directories — `apps/` and `packages/` —
plus root documentation and configuration. There is **no third top-level application
directory**.

```
.
├── AGENTS.md                    # This guide — authoritative source of truth
├── README.md                   # Small landing page (overview + links to Setup.md and AGENTS.md)
├── Setup.md                    # Setup_Guide: install & run instructions (human-facing)
├── .gitignore                  # Excludes real .env files, caches, node_modules, lockfile noise
├── package.json                 # Root Turborepo scripts + Node engine requirement
├── pnpm-workspace.yaml          # pnpm workspace membership
├── pnpm-lock.yaml               # Root workspace lockfile (committed)
├── turbo.json                   # Cached task graph for Node workspaces
├── apps/
│   ├── api/                    # Backend_App — FastAPI, managed with uv
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── main.py         # Creates the FastAPI app; registers routers (no route logic)
│   │   │   ├── config.py       # Typed Settings (Pydantic BaseSettings) from env
│   │   │   ├── db.py           # Engine, SessionLocal factory, get_db dependency
│   │   │   ├── models.py       # SQLAlchemy declarative Base + ORM models (autogenerate target)
│   │   │   ├── schemas.py      # Pydantic v2 request/response models
│   │   │   ├── routes.py       # Application API routes (Example_Endpoint: /items)
│   │   │   ├── auth.py         # Generic signed-session API example
│   │   │   └── health.py       # Health_Endpoint (GET /health), kept separate from routes
│   │   ├── alembic/            # Migration environment (env.py, script.py.mako, versions/)
│   │   ├── alembic.ini         # Alembic configuration
│   │   ├── pyproject.toml      # Dependencies + [tool.ruff] / [tool.ty] config (uv)
│   │   ├── uv.lock             # Backend lockfile (committed)
│   │   └── .env.example        # Documents DATABASE_URL with a placeholder value
│   └── web/                    # Frontend_App — Next.js 16.3 App Router, managed with pnpm
│       ├── app/
│       │   ├── layout.tsx      # Root layout; imports globals.css
│       │   ├── page.tsx        # Example_Page (Server Component + Suspense)
│       │   ├── actions/auth.ts # Server Actions that own HttpOnly session cookies
│       │   ├── error.tsx       # Route error boundary
│       │   └── globals.css     # Tailwind CSS v4 theme and utilities import
│       ├── lib/
│       │   ├── api/            # Hey API generated SDK + server-only wrappers
│       │   ├── env.ts          # Zod-validated server environment variables
│       │   ├── auth.ts         # HttpOnly-cookie reader for SSR requests
│       │   └── utils.ts        # Shared utilities (e.g., shadcn `cn` helper)
│       ├── components/ui/      # shadcn/ui generated primitives live here
│       ├── components.json     # shadcn/ui configuration
│       ├── package.json        # Scripts + packageManager (pnpm)
│       ├── tsconfig.json       # TypeScript strict mode
│       ├── openapi-ts.config.ts # Hey API generator configuration
│       ├── postcss.config.mjs  # Tailwind CSS v4 PostCSS configuration
│       └── .env.local.example  # Documents server-only API_URL and cookie name
└── packages/
    └── shared/                 # Shared_Package placeholder (README only; no app code yet)
        └── README.md
```

---

## 3. Core Principles

1. **Typed end to end.** Every Python function has typed parameters and a typed return
   value; TypeScript runs in strict mode. The "tests" for this template are the static
   checks (type checking, linting, format checking), not a test runner.
2. **Small, flat, explicit.** Predictable layout with one clearly-named file per
   responsibility. A request can be read top to bottom, from route to database.
3. **Generic.** Example code uses placeholder names and carries no business logic, so the
   template can be cloned into unrelated projects without deleting inherited domain code.
4. **Production-ready without enterprise heaviness.** The scaffold includes a minimal,
   server-managed cookie-session example; replace its generic demo credential endpoint
   with a real identity provider before deployment. Containers, CI, and background workers
   remain out of scope by default.

## 3. Code Quality Instructions

1. Place all constants, configurations, JSON schemas, and enums in dedicated `config`, `constants`, or `enums` files.
2. Break large code blocks into smaller, modular functions, services, or reusable components wherever possible.
3. Follow standard file and folder naming conventions to keep the project structure clean and predictable.
4. Keep docstrings short, clear, and useful. Avoid overly long explanations.
5. Add concise comments only where they improve readability or explain non-obvious logic. Avoid unnecessary comments.


## 4. Backend Instructions

The Backend_App lives at `apps/api` and is managed with `uv`.

- **Python 3.12+** (`requires-python = ">=3.12"` in `pyproject.toml`).
- **One file per responsibility** in `app/`:
  - `main.py` — creates the FastAPI app and registers routers; contains **no route logic**.
  - `config.py` — typed `Settings` object populated from environment variables.
  - `db.py` — SQLAlchemy engine, `SessionLocal` factory, and the `get_db` dependency.
  - `models.py` — declarative `Base` and ORM models.
  - `schemas.py` — Pydantic v2 request/response models.
  - `routes.py` — application API routes.
  - `health.py` — the Health_Endpoint, kept separate from application routes.
- **Every function is fully typed** — typed parameters **and** a typed return value. No
  exceptions; this is what `ty` verifies.
- The FastAPI application object is **`app.main:app`**. Run it with
  `uv run uvicorn app.main:app --reload` from within `apps/api`.
- Routers are defined in `routes.py`, `health.py`, and `auth.py` and registered in `main.py` via
  `app.include_router(...)`.
- The database schema is created **only** by the Migration_System (Alembic). Never call
  `Base.metadata.create_all(...)`.

---

## 5. Frontend Instructions

The Frontend_App lives at `apps/web` and is managed with `pnpm`.

- **Next.js 16.3 App Router only.** Use the `app/` directory. Do **not** create a `pages/`
  directory (the legacy Pages Router is omitted). Pages and data components are Server
  Components by default; add `"use client"` only for browser interaction.
- **Strict TypeScript.** `tsconfig.json` enables `"strict": true`. Keep it strict.
- **Styling with Tailwind CSS v4 + shadcn/ui.** Global styles are in `app/globals.css`;
  generated UI primitives live in `components/ui/`.
- **All backend calls use the Hey API generated SDK.** Run `pnpm generate:api` whenever
  FastAPI's OpenAPI contract changes. Components call server-only wrappers in `lib/api/`;
  they never call `fetch` inline.
- **Use Suspense and error boundaries.** Stream async Server Components behind Suspense
  and keep `app/error.tsx` / `app/global-error.tsx` for unexpected failures.
- **Forms use React Hook Form and Server Actions.** Validate both client-side and in the
  Server Action; Server Actions own every write to HttpOnly cookies.

---

## 6. Database & Migration Rules

- **Alembic is the only schema creator.** There is **no `create_all`** anywhere. Every
  schema change is a reviewable, versioned migration.
- **`Base.metadata` in `app/models.py` is the autogenerate target.** `alembic/env.py`
  imports `Base` from `app.models` and sets `target_metadata = Base.metadata`.
- **The connection URL comes from the environment** (`DATABASE_URL` via `Settings`), not a
  hardcoded `sqlalchemy.url` in `alembic.ini`.
- **PostgreSQL is the default** database (see `apps/api/.env.example`).

Workflow when you change a model (run within `apps/api`):

```bash
# 1. Generate a migration from the model change
uv run alembic revision --autogenerate -m "describe the change"

# 2. Review the generated file under alembic/versions/, then apply it
uv run alembic upgrade head
```

---

## 7. Dependency Management

- **Backend uses `uv` only.** Add/sync dependencies through `uv`; dependencies are
  declared in `apps/api/pyproject.toml`.
  ```bash
  uv add <package>      # add a runtime dependency
  uv add --dev <package> # add a dev dependency
  uv sync               # install/sync the environment from the lockfile
  ```
  Commit `apps/api/uv.lock`.
- **Frontend uses `pnpm` only.** Never use `npm` or `yarn`. This is a pnpm workspace, so
  dependency installation and the committed `pnpm-lock.yaml` live at the repository root.
  ```bash
  pnpm --filter @template/web add <package>     # add a web dependency
  pnpm --filter @template/web add -D <package>  # add a web dev dependency
  pnpm install                                   # install the root workspace lockfile
  ```
  Commit root `pnpm-lock.yaml`. **Never commit `package-lock.json` or `yarn.lock`** —
  they are excluded by `.gitignore` and must stay out of version control.

---

## 8. Type Checking & Linting

These are the **verification gates**. Work is not done until they all pass.

**Backend** (run within `apps/api`):

```bash
uv run ty check               # type checking — must report zero errors
uv run ruff check .           # linting — must report zero errors
uv run ruff format --check .  # formatting — must report all files formatted
```

(Use `uv run ruff format .` to auto-format before checking.)

**Frontend** (run within `apps/web`):

```bash
pnpm lint        # linting — must report zero errors
pnpm typecheck   # tsc --noEmit — must report zero type errors
```

Or run all Node workspaces from the repository root through Turborepo:

```bash
pnpm lint
pnpm typecheck
```

There is **no test command** to run — this template has no testing setup (see
[§1](#1-purpose) and [§14](#14-prohibited-actions)). The static checks above are the
complete verification suite.

---

## 9. AI Agent Workflow

On every task:

1. **Read `AGENTS.md` first** (this file) and follow its conventions. It is the
   authoritative source of truth and wins on any conflict.
2. **Follow the established conventions** — file layout, typing, the one-file-per-
   responsibility backend structure, and the generated Hey API wrapper rule on the frontend.
3. **Make the change** in the smallest, most explicit way that fits the existing patterns.
4. **Run the checks before considering work done:** all backend checks within `apps/api`
   and all frontend checks within `apps/web` (see [§8](#8-type-checking--linting)).
5. **If you changed structure, build, or run steps, update `AGENTS.md` (and `Setup.md`/
   `README.md` where relevant) in the same change.**

---

## 10. Safe Refactoring Rules

- **Keep changes small and focused.** Refactor one responsibility at a time.
- **Preserve types.** Do not weaken or drop type annotations; both apps stay fully typed.
- **Preserve the layout.** Keep one file per backend responsibility; keep all backend
  calls in the generated Hey API SDK and `lib/api/` server-only wrappers on the frontend.
- **Run the checks after every refactor** ([§8](#8-type-checking--linting)) and fix any
  issues before finishing.
- **Do not add scope.** A refactor should not introduce tests, CI, containers, or
  speculative abstractions (see [§14](#14-prohibited-actions)).

---

## 11. API Design Rules

- **RESTful resource routes.** Group routes by resource using an `APIRouter` with a
  resource `prefix` (the example uses `/items`).
- **Explicit `response_model`.** Every route declares an explicit `response_model` backed
  by a **Pydantic v2** schema from `schemas.py`. Use `ConfigDict(from_attributes=True)` so
  ORM objects serialize cleanly.
- **Sessions via the `get_db` dependency.** When a route needs the database, obtain the
  session with `db: Session = Depends(get_db)` — never construct sessions inline.
- **No business logic in `main.py`.** It only composes routers.
- **Keep examples generic.** Use placeholder resource names; do not embed project-specific
  semantics in the template's example route.

---

## 12. Frontend Design Rules

- **Generated Hey API SDK.** `openapi-ts.config.ts` generates `lib/api/generated/` from
  FastAPI's OpenAPI document using `@hey-api/client-next`. Do not hand-edit generated files;
  call typed server-only wrappers in `lib/api/` instead.
- **Validated server environment.** `lib/env.ts` validates `API_URL` and `AUTH_COOKIE_NAME`
  with Zod. Neither value uses a `NEXT_PUBLIC_` prefix or reaches browser code.
- **HttpOnly session cookie.** `app/actions/auth.ts` is the only cookie writer. It receives
  the access token from the API, sets a Secure-in-production HttpOnly SameSite=Lax cookie,
  and Server Components forward it as a bearer token during SSR.
- **Render loading and error states.** Use `Suspense` / `loading.tsx` for pending work and
  `error.tsx` for unexpected failures.
- **shadcn primitives go in `components/ui/`.** Add them with the shadcn CLI:
  ```bash
  pnpm dlx shadcn@latest add <component>
  ```

---

## 13. Environment Variables

- **Backend:** `DATABASE_URL` is read by `app/config.py` (and Alembic). Configure it in
  `apps/api/.env` (copy from the committed `apps/api/.env.example`). PostgreSQL by default.
- **Frontend:** `API_URL` and `AUTH_COOKIE_NAME` are validated by `lib/env.ts`. Configure
  them in `apps/web/.env.local` (copy from the committed `apps/web/.env.local.example`).
  They are server-only and must not be renamed with a `NEXT_PUBLIC_` prefix.
- **Use the example files.** `.env.example` and `.env.local.example` are committed and
  contain **placeholder values only**.
- **Never commit real secrets.** Real `.env` and `.env.local` files are excluded by
  `.gitignore` and must stay out of version control.

---

## 14. Prohibited Actions

Do **not**, as part of routine work on this template:

- **Add any test scaffolding** — no test runner, test framework, or test files. This
  template intentionally has **no testing setup**, and tests are **not required**.
- **Add containerization** (Dockerfiles, compose files, etc.). Omitted by default.
- **Add continuous integration** (CI workflows/pipelines). Omitted by default.
- **Add background workers** (queues, schedulers, task runners). Omitted by default.
- **Add project-specific business logic.** The template stays generic; examples use
  generic placeholder names (e.g., `Item`) and carry no domain meaning.
- **Put speculative code in `packages/shared`.** Add code there only when it is genuinely
  shared by more than one consumer.
- **Use inline `fetch` in components.** All backend calls go through the generated Hey API
  SDK and typed wrappers in `lib/api/`.
- **Commit `package-lock.json` or `yarn.lock`.** Frontend uses `pnpm` (`pnpm-lock.yaml`).
- **Call `Base.metadata.create_all(...)`.** Alembic is the only schema creator.

---

## 15. Required Skills

To work in this repository you should be comfortable with:

- **`uv`** — Python environment, dependency, and command runner for the backend.
- **`ty`** — Python type checker (the backend type-checking gate).
- **`ruff`** — Python linter and formatter (the backend lint/format gates).
- **Node.js + `pnpm`** — the frontend runtime and package manager.
- **Turborepo** — root task orchestration for Node workspaces.
- **React Hook Form + Zod** — client form state and shared validation schemas.
- **Hey API** — OpenAPI-driven TypeScript client generation with `client-next`.
- **shadcn CLI** — adding UI primitives via `pnpm dlx shadcn@latest add <component>`.

See [`Setup.md`](Setup.md) (the Setup_Guide) for installation instructions for each tool,
including what to do if a tool is unavailable in your environment.

---

## 16. New-Feature Workflow

A typical full-stack feature, end to end:

1. **Model** — add or extend an ORM model in `app/models.py`.
2. **Schema** — add the matching Pydantic v2 request/response model in `app/schemas.py`.
3. **Route** — add a RESTful route in `app/routes.py` with an explicit `response_model`,
   using `Depends(get_db)` for database access.
4. **Migration** — generate and apply the schema change:
   ```bash
   uv run alembic revision --autogenerate -m "add <feature>"
   uv run alembic upgrade head
   ```
5. **Frontend client** — regenerate the Hey API client with `pnpm generate:api`, then add a
   typed server-only wrapper in `apps/web/lib/api/` for the new endpoint.
6. **Page/UI** — build the page or component using that helper, with loading and error
   states; add shadcn primitives via the CLI if needed.
7. **Run the checks** — backend (`uv run ty check`, `uv run ruff check .`,
   `uv run ruff format --check .`) and frontend (`pnpm lint`, `pnpm typecheck`).
8. **Update docs** — if you changed structure/build/run, update `AGENTS.md` and
   `Setup.md` (and `README.md` if the overview changed).

---

## 17. Bug-Fix Workflow

1. **Reproduce** the bug (hit the endpoint, load the page, or observe the failing check).
2. **Locate** it using the one-file-per-responsibility layout — follow the request from
  `main.py` → `routes.py`/`health.py`/`auth.py` → `schemas.py` → `db.py`/`models.py` on the backend,
  or from `app/page.tsx` → `lib/api/` on the frontend.
3. **Fix** the smallest thing that resolves the issue, preserving types and conventions.
4. **Run the checks** ([§8](#8-type-checking--linting)) and confirm they all pass.
5. **Update docs** if the fix changed structure, build, or run steps.

---

## 18. Definition of Done

A change is done when **all** of the following hold:

- **All backend static checks pass** within `apps/api`:
  - `uv run ty check` → zero type errors
  - `uv run ruff check .` → zero lint errors
  - `uv run ruff format --check .` → all files formatted
- **All frontend static checks pass** within `apps/web`:
  - `pnpm lint` → zero lint errors
  - `pnpm typecheck` → zero type errors
- **`AGENTS.md` and `Setup.md` (and `README.md` where relevant) are updated** if the
  change altered how the repository is structured, built, or run.
- **No test setup was added** — this template intentionally ships without one.

---

## 19. Agentic Coding Principles

These principles guide how an agent (or human) should approach changes in this repository.
They are adapted from [Andrej Karpathy's agentic coding guide](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)
and reframed to fit this template — most importantly, its verification loop is built on
**static checks, not tests** (this template has no testing setup; see
[§1](#1-purpose), [§8](#8-type-checking--linting), and [§14](#14-prohibited-actions)).

1. **Think before coding.** Make your assumptions explicit before writing code. When a
   request could be read more than one way, surface the alternatives rather than silently
   committing to one. Favor the simpler path, and say so when a requested approach seems
   heavier than the problem needs. If something is genuinely unclear, pause and ask instead
   of guessing.
2. **Simplicity first.** Write only the code the task actually needs. Skip speculative
   features, avoid abstractions for code that has a single caller, do not add
   configuration nobody asked for, and do not guard against scenarios that cannot occur.
   This mirrors the template's "small, flat, explicit" principle (see
   [§3](#3-core-principles)).
3. **Surgical changes.** Touch only what the task requires. Leave adjacent code alone — do
   not "improve" or reformat lines unrelated to your change, and match the surrounding
   style. Clean up only the loose ends your own edit creates; if you spot pre-existing dead
   code, mention it rather than deleting it as a drive-by.
4. **Goal-driven execution.** Turn each task into a concrete, verifiable goal and keep
   iterating until it is met. **Verification in this repository is the static checks, not
   tests** — back end `uv run ty check` / `uv run ruff check .` /
   `uv run ruff format --check .`, and front end `pnpm lint` / `pnpm typecheck` (see
   [§8](#8-type-checking--linting)). Loop on those checks until they all pass; that is the
   success criterion. Do **not** write tests or add a test setup to satisfy this loop (see
   [§14](#14-prohibited-actions)).

Adapted from [Andrej Karpathy's agentic coding guide](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md).
Content was rephrased for compliance with licensing restrictions.
