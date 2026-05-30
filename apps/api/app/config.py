"""Typed application settings loaded from the environment.

Exposes a Pydantic ``Settings`` object populated from environment variables
(and an optional ``.env`` file) plus a cached ``get_settings()`` accessor so
the parsed configuration is built once and reused across the application.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration sourced from environment variables.

    The ``database_url`` field is read from the ``DATABASE_URL`` environment
    variable (matching is case-insensitive) and drives both the SQLAlchemy
    engine and the Alembic migration environment.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str


@lru_cache
def get_settings() -> Settings:
    """Return a cached, validated ``Settings`` instance.

    The ``lru_cache`` decorator ensures the environment is parsed once and the
    same immutable settings object is shared by every caller.
    """

    # ``BaseSettings`` populates ``database_url`` from the environment, which the
    # static type checker cannot model, so it wrongly reports a missing argument.
    return Settings()  # ty: ignore[missing-argument]
