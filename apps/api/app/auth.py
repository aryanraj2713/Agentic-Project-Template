"""Generic bearer-session endpoints for the template's cookie-auth example."""

import base64
import hashlib
import hmac
import json
import secrets
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import get_settings
from app.schemas import SessionCredentials, SessionToken, SessionUser

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)


def _base64url_encode(value: bytes) -> str:
    """Encode bytes as unpadded URL-safe base64."""

    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def _base64url_decode(value: str) -> bytes:
    """Decode an unpadded URL-safe base64 value."""

    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def _sign(payload: str) -> str:
    """Return the HMAC signature for an encoded session payload."""

    secret = get_settings().auth_session_secret.encode("utf-8")
    return _base64url_encode(hmac.new(secret, payload.encode("ascii"), hashlib.sha256).digest())


def _create_access_token(username: str) -> SessionToken:
    """Create a signed, expiring token for the generic template user."""

    expires_at = datetime.now(UTC) + timedelta(seconds=get_settings().auth_session_ttl_seconds)
    payload = _base64url_encode(
        json.dumps({"exp": int(expires_at.timestamp()), "sub": username}).encode("utf-8")
    )
    return SessionToken(access_token=f"{payload}.{_sign(payload)}", expires_at=expires_at)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> SessionUser:
    """Validate a bearer token and return its generic subject."""

    invalid_token = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired session token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None or not secrets.compare_digest(credentials.scheme.lower(), "bearer"):
        raise invalid_token

    try:
        payload, signature = credentials.credentials.split(".", maxsplit=1)
        if not secrets.compare_digest(signature, _sign(payload)):
            raise invalid_token
        claims = json.loads(_base64url_decode(payload))
        username = claims["sub"]
        expires_at = int(claims["exp"])
    except (KeyError, TypeError, ValueError, json.JSONDecodeError) as error:
        raise invalid_token from error

    if not isinstance(username, str) or datetime.now(UTC).timestamp() >= expires_at:
        raise invalid_token
    return SessionUser(username=username)


@router.post("/session", response_model=SessionToken)
def create_session(credentials: SessionCredentials) -> SessionToken:
    """Exchange configured generic demo credentials for an access token."""

    settings = get_settings()
    if not (
        secrets.compare_digest(credentials.username, settings.auth_demo_username)
        and secrets.compare_digest(credentials.password, settings.auth_demo_password)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    return _create_access_token(credentials.username)


@router.get("/session", response_model=SessionUser)
def read_session(current_user: SessionUser = Depends(get_current_user)) -> SessionUser:
    """Return the user represented by the submitted bearer session."""

    return current_user
