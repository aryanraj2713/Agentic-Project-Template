# Agentic (Next.js + FastAPI) Template

A typed, full-stack monorepo template you can clone as the starting point for a new
project. It pairs a [FastAPI](https://fastapi.tiangolo.com/) backend managed with
[`uv`](https://docs.astral.sh/uv/) (`apps/api`) with a [Next.js](https://nextjs.org/) App
Router frontend managed with [`pnpm`](https://pnpm.io/) (`apps/web`), plus a reserved
`packages/shared` placeholder for genuinely-shared code. It ships scaffolding, tooling,
documentation, and minimal generic examples — no business logic. The layout stays small,
flat, and explicit so it is friendly for both humans and AI agents to build on.

## Documentation

- **Setup & run instructions** → [`Setup.md`](Setup.md)
- **Coding conventions & agent guide** → [`AGENTS.md`](AGENTS.md)

The template intentionally has no testing setup; correctness is verified through static
checks (type checking, linting, and format checking — see [`Setup.md`](Setup.md)).

## License

Licensed under the [Apache License 2.0](LICENSE).
