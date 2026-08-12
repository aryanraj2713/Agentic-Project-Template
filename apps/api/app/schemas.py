"""Pydantic v2 request/response models for the example resource.

Defines the transport-layer schemas used by the API. ``ItemRead`` is the
response model for the generic placeholder ``Item`` resource; enabling
``from_attributes=True`` lets FastAPI serialize SQLAlchemy ORM objects directly
through ``response_model`` without manual conversion. The model is intentionally
trivial (an ``id`` and a ``name``) and carries no domain logic.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ItemRead(BaseModel):
    """Response schema for a single ``Item``.

    ``from_attributes=True`` allows the model to be populated from ORM instance
    attributes, so route handlers can return ``Item`` objects directly and let
    FastAPI handle serialization via the declared ``response_model``.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class SessionCredentials(BaseModel):
    """Generic sign-in credentials for the template's development flow."""

    username: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=1, max_length=255)


class SessionToken(BaseModel):
    """Signed bearer token returned to the Next.js server action."""

    access_token: str
    expires_at: datetime
    token_type: str = "bearer"


class SessionUser(BaseModel):
    """Minimal authenticated principal for the generic template."""

    username: str
