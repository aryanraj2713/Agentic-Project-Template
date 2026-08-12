"""Application factory and entrypoint for the Backend_App.

Builds the FastAPI application and registers the routers that own the actual
request handling: the Health_Endpoint (``app.health``) and the application
routes (``app.routes``). This module deliberately contains no route logic of
its own so the wiring of the service can be read in one place, separate from
the handlers it composes.
"""

from fastapi import FastAPI

from app.auth import router as auth_router
from app.health import router as health_router
from app.routes import router as items_router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance.

    Instantiates the application and registers the health and items routers,
    returning the assembled app. Route logic lives in the included routers
    rather than here, so this factory only performs composition.
    """

    app = FastAPI(title="Fullstack Monorepo Template API")
    app.include_router(health_router)
    app.include_router(auth_router)
    app.include_router(items_router)
    return app


app: FastAPI = create_app()
