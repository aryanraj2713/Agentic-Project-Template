"""SQLAlchemy declarative base and ORM models.

Defines the declarative ``Base`` that all ORM models inherit from and a generic
placeholder ``Item`` model. ``Base.metadata`` is the single source of schema
metadata that Alembic targets for autogenerating migrations. The ``Item`` model
is intentionally trivial (an ``id`` and a ``name``) and carries no domain logic;
it exists only to demonstrate the standard model pattern.
"""

from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Declarative base shared by every ORM model.

    ``Base.metadata`` collects the table definitions of all subclasses and is
    referenced by the Alembic environment as the autogenerate target.
    """


class Item(Base):
    """Generic placeholder resource used to demonstrate the ORM pattern."""

    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
