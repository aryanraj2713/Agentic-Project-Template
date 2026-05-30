# Setup & Run Guide

This is the human-facing setup, install, and run guide for the template. For coding
conventions and the authoritative source of truth, see [`AGENTS.md`](AGENTS.md); for a
short overview of the template, see [`README.md`](README.md).

This is a generic, reusable full-stack monorepo:

- **`apps/api`** — A [FastAPI](https://fastapi.tiangolo.com/) backend managed with [`uv`](https://docs.astral.sh/uv/). Fully type-hinted, with [SQLAlchemy](https://www.sqlalchemy.org/) models and [Alembic](https://alembic.sqlalchemy.org/) migrations against PostgreSQL.
- **`apps/web`** — A [Next.js](https://nextjs.org/) App Router frontend written in strict TypeScript, styled with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/), using [`pnpm`](https://pnpm.io/) as its package manager.
- **`packages/shared`** — A placeholder for code that becomes genuinely shared across apps. It is intentionally empty until something is actually shared.

> **No testing setup.** This template intentionally ships with no test runner, test framework, or test scaffolding. Correctness is verified through static checks: type checking, linting, and format checking (see [Verification checks](#verification-checks)).

## Prerequisites and tooling

You will need the tools below. Each entry explains what the tool is and how to install it if it is not already available. Verify a tool is present by running its `--version` command (e.g. `uv --version`); if the command is not found, install it using the matching instructions.

### `uv` (Python package and project manager)

`uv` manages the backend's Python version, virtual environment, dependencies, and command running. It is the only tool you need to install by hand for the backend — `ty` and `ruff` come in as dev dependencies through `uv`.

Install it if `uv --version` fails:

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# or with Homebrew
brew install uv
```

See the [uv installation docs](https://docs.astral.sh/uv/getting-started/installation/) for more options.

### `ty` (Python type checker)

`ty` is the type checker used to verify the backend's type hints. **You do not install it separately** — it is declared as a backend dev dependency and is installed automatically by `uv sync`. Run it through `uv run ty check` from within `apps/api`. If it is ever missing, re-run `uv sync` inside `apps/api`.

### `ruff` (Python linter and formatter)

`ruff` lints and formats the backend code. Like `ty`, it is a backend dev dependency installed by `uv sync` — there is no separate install step. Run it through `uv run ruff ...` from within `apps/api`. If it is ever missing, re-run `uv sync` inside `apps/api`.

### Node.js and `pnpm` (frontend runtime and package manager)

The frontend runs on Node.js and uses `pnpm` for dependency management.

- **Node.js** — install the current LTS from [nodejs.org](https://nodejs.org/) or a version manager such as [`nvm`](https://github.com/nvm-sh/nvm). Verify with `node --version`.
- **`pnpm`** — the easiest path is [Corepack](https://nodejs.org/api/corepack.html), which ships with Node.js:

  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```

  Alternatively, install it standalone:

  ```bash
  # standalone script (macOS / Linux)
  curl -fsSL https://get.pnpm.io/install.sh | sh -

  # or with npm
  npm install -g pnpm

  # or with Homebrew
  brew install pnpm
  ```

  Verify with `pnpm --version`. See the [pnpm installation docs](https://pnpm.io/installation) for more options.

### shadcn CLI (UI component generator)

The shadcn/ui CLI adds pre-built, accessible UI primitives into `apps/web/components/ui`. There is nothing to install globally — run it on demand with `pnpm dlx`:

```bash
pnpm dlx shadcn@latest <command>
```

`pnpm dlx` downloads and runs the latest CLI for a single invocation. See [Adding shadcn/ui components](#adding-shadcnui-components) below.

## Backend (`apps/api`)

All backend commands run from inside `apps/api`.

### Setup

```bash
cd apps/api
cp .env.example .env   # then edit .env with your real values
uv sync                # creates the virtualenv and installs all dependencies
```

`uv sync` installs runtime dependencies (FastAPI, Pydantic v2, SQLAlchemy, Alembic, the psycopg driver) and the dev tools (`ty`, `ruff`). Edit `.env` so `DATABASE_URL` points at your PostgreSQL instance — the default placeholder is `postgresql+psycopg://user:password@localhost:5432/appdb`.

### Run

```bash
cd apps/api
uv run uvicorn app.main:app --reload
```

The FastAPI application object is `app.main:app`. By default it serves on `http://localhost:8000`.

#### Health check

The backend exposes a health endpoint at:

```
GET /health
```

It returns HTTP `200` with the JSON body:

```json
{ "status": "ok" }
```

This is the cheapest signal that the backend boots and serves requests. Once the server is running, verify it with:

```bash
curl http://localhost:8000/health
```

### Database migrations

Schema is managed exclusively through Alembic — there is no runtime `create_all`. Run these from inside `apps/api`.

Create a migration after changing a model in `app/models.py`:

```bash
cd apps/api
uv run alembic revision --autogenerate -m "describe your change"
```

This writes a new migration file under `apps/api/alembic/versions`.

Apply outstanding migrations to the database in your `DATABASE_URL`:

```bash
cd apps/api
uv run alembic upgrade head
```

## Frontend (`apps/web`)

All frontend commands run from inside `apps/web`.

### Setup

```bash
cd apps/web
cp .env.local.example .env.local   # then edit .env.local with your values
pnpm install
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to the backend base URL (default placeholder `http://localhost:8000`). `lib/api.ts` reads this variable for all backend calls and throws a named error if it is missing.

### Run

```bash
cd apps/web
pnpm dev
```

The dev server runs on `http://localhost:3000` by default.

### Adding shadcn/ui components

Add UI primitives into `apps/web/components/ui` with the shadcn CLI via `pnpm dlx`:

```bash
cd apps/web
pnpm dlx shadcn@latest add <component>
```

For example, `pnpm dlx shadcn@latest add button` generates a `button` component you can import from `@/components/ui/button`.

## Verification checks

This template has no automated tests by design. Verify correctness with the static checks below.

Backend — run within `apps/api`:

```bash
cd apps/api
uv run ty check              # type checking — expects zero type errors
uv run ruff check .          # linting — expects zero lint errors
uv run ruff format --check . # formatting — expects all files already formatted
```

Frontend — run within `apps/web`:

```bash
cd apps/web
pnpm lint        # linting — expects zero lint errors
pnpm typecheck   # tsc --noEmit — expects zero type errors
```

See [`AGENTS.md`](AGENTS.md) for the full conventions, workflows, and definition of done.
