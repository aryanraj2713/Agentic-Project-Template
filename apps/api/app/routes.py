"""Application API routes (Example_Endpoint).

Exposes the generic ``/items`` resource that demonstrates the standard route
pattern: an ``APIRouter`` with a RESTful resource prefix, an explicit
``response_model`` for serialization, and a database session obtained through
the ``get_db`` dependency. The handler is intentionally trivial and carries no
project-specific business logic; it exists only as a concrete pattern to copy
when adding real routes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Item
from app.schemas import ItemRead

router = APIRouter(prefix="/items", tags=["items"])


@router.get("", response_model=list[ItemRead])
def list_items(db: Session = Depends(get_db)) -> list[ItemRead]:
    """Return every ``Item`` from the database as ``ItemRead`` responses.

    Obtains a session via ``Depends(get_db)``, queries all rows of the generic
    placeholder resource, and serializes them through the declared
    ``response_model``. The query uses the injected session so persistence
    access always flows through the standard dependency.
    """

    items = db.execute(select(Item)).scalars().all()
    return [ItemRead.model_validate(item) for item in items]
