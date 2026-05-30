#!/usr/bin/env bash
#
# install-skills.sh
#
# Installs the agent "skills" used by this template, one at a time, via the
# `skills` CLI (run through `npx`).
#
# Usage:
#   ./scripts/install-skills.sh
#
# Requirements:
#   - Node.js + npx (see Setup.md for installation)

set -euo pipefail

npx skills add https://github.com/anthropics/skills --skill frontend-design
npx skills add https://github.com/fastapi/fastapi --skill fastapi
npx skills add https://github.com/wshobson/agents --skill python-anti-patterns
npx skills add https://github.com/wispbit-ai/skills --skill sqlalchemy-alembic-expert-best-practices-code-review
npx skills add https://github.com/jezweb/claude-skills --skill nextjs
npx skills add https://github.com/github/awesome-copilot --skill git-commit
npx skills add https://github.com/mindrally/skills --skill fastapi-python

echo "All skills installed."
