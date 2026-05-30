"""Health-check endpoint for the Backend_App.

Exposes a trivial ``GET /health`` route on its own ``APIRouter``, kept separate
from the application routes so the cheapest possible "is the service up?" signal
has no dependency on database access or domain logic. The endpoint returns HTTP
200 with a small JSON body reporting the service status.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    """Return a JSON status body confirming the service is reachable.

    Responds to ``GET /health`` with HTTP 200 and ``{"status": "ok"}``. The
    handler performs no I/O so it stays a fast, dependency-free liveness probe.
    """

    return {"status": "ok"}
