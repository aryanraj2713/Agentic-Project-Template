#!/usr/bin/env bash
#
# setup.sh
#
# One-shot local setup for the template, following Setup.md:
#   - checks prerequisites (uv, node, pnpm)
#   - backend  (apps/api): create .env from .env.example, then `uv sync`
#   - frontend (apps/web): create .env.local from .env.local.example, then root `pnpm install`
#
# It does NOT start the dev servers or run migrations — see Setup.md for those.
# Re-running is safe: existing .env files are left untouched.
#
# Usage:
#   ./scripts/setup.sh
#
# This template intentionally has no testing setup; correctness is verified
# through static checks (see "Verification checks" in Setup.md).

set -euo pipefail

# Resolve the repository root (this script lives in <root>/scripts).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

API_DIR="${ROOT_DIR}/apps/api"
WEB_DIR="${ROOT_DIR}/apps/web"

info()  { printf '\n==> %s\n' "$1"; }
warn()  { printf 'warning: %s\n' "$1" >&2; }
die()   { printf 'error: %s\n' "$1" >&2; exit 1; }

# ---------------------------------------------------------------------------
# Prerequisites
# ---------------------------------------------------------------------------
info "Checking prerequisites"

command -v uv >/dev/null 2>&1 \
  || die "'uv' not found. Install it (see Setup.md), e.g. 'curl -LsSf https://astral.sh/uv/install.sh | sh'."
echo "    uv:   $(uv --version)"

command -v node >/dev/null 2>&1 \
  || die "'node' not found. Install Node.js LTS (see Setup.md)."
echo "    node: $(node --version)"

if ! command -v pnpm >/dev/null 2>&1; then
  die "'pnpm' not found. Enable it with 'corepack enable && corepack prepare pnpm@latest --activate' (see Setup.md)."
fi
echo "    pnpm: $(pnpm --version)"

# ---------------------------------------------------------------------------
# Backend (apps/api)
# ---------------------------------------------------------------------------
info "Setting up the backend (apps/api)"

if [ ! -f "${API_DIR}/.env" ]; then
  cp "${API_DIR}/.env.example" "${API_DIR}/.env"
  echo "    created apps/api/.env from .env.example — edit DATABASE_URL before running."
else
  echo "    apps/api/.env already exists — leaving it untouched."
fi

( cd "${API_DIR}" && uv sync )
echo "    backend dependencies installed via 'uv sync'."

# ---------------------------------------------------------------------------
# Frontend (apps/web)
# ---------------------------------------------------------------------------
info "Setting up the frontend (apps/web)"

if [ ! -f "${WEB_DIR}/.env.local" ]; then
  cp "${WEB_DIR}/.env.local.example" "${WEB_DIR}/.env.local"
  echo "    created apps/web/.env.local from .env.local.example — set API_URL if needed."
else
  echo "    apps/web/.env.local already exists — leaving it untouched."
fi

( cd "${ROOT_DIR}" && pnpm install )
echo "    frontend workspace dependencies installed via root 'pnpm install'."

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
info "Setup complete"
cat <<'EOF'
Next steps (see Setup.md for details):
  - Backend:  cd apps/api && uv run uvicorn app.main:app --reload   # http://localhost:8000
  - Migrate:  cd apps/api && uv run alembic upgrade head
  - Frontend: pnpm dev                                               # http://localhost:3000
EOF
