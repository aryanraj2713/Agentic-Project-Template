"""Pydantic v2 request/response models for the example resource.

Defines the transport-layer schemas used by the API. ``ItemRead`` is the
response model for the generic placeholder ``Item`` resource; enabling
``from_attributes=True`` lets FastAPI serialize SQLAlchemy ORM objects directly
through ``response_model`` without manual conversion. The model is intentionally
trivial (an ``id`` and a ``name``) and carries no domain logic.
"""

from pydantic import BaseModel, ConfigDict


class ItemRead(BaseModel):
    """Response schema for a single ``Item``.

    ``from_attributes=True`` allows the model to be populated from ORM instance
    attributes, so route handlers can return ``Item`` objects directly and let
    FastAPI handle serialization via the declared ``response_model``.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
