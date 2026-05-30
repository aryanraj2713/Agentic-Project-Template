"""Database engine, session factory, and request-scoped session dependency.

Builds the SQLAlchemy engine from the application's ``database_url`` setting,
exposes a ``SessionLocal`` factory for creating sessions, and provides the
``get_db`` generator dependency that yields a session and guarantees it is
closed once the request completes.
"""

from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings

engine = create_engine(get_settings().database_url)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Iterator[Session]:
    """Yield a database session and close it when the caller is done.

    Intended for use as a FastAPI dependency via ``Depends(get_db)``: the
    session is created from ``SessionLocal``, handed to the route, and closed in
    the ``finally`` block regardless of whether the request succeeds or raises.
    """

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
