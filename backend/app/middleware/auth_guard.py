from __future__ import annotations

from fastapi import HTTPException, Request, status


def require_authenticated_user(current_user_id: str | None) -> str:
    """Support CON-SRS-01, NFR-SRS-01, and CON-RPS-01 by rejecting unauthenticated requests."""
    if current_user_id is None or not str(current_user_id).strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to search for roommates.",
        )
    return str(current_user_id).strip()


def get_authenticated_user_id(request: Request) -> str:
    """Read the authenticated identity supplied by trusted middleware (CON-RPS-01)."""
    user_id = getattr(request.state, "user_id", None)
    if not isinstance(user_id, str):
        user_id = None
    return require_authenticated_user(user_id)
