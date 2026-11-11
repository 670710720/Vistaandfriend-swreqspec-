from __future__ import annotations

from fastapi import HTTPException, status


def require_authenticated_user(current_user_id: str | None) -> str:
    """Support CON-SRS-01 and NFR-SRS-01 by rejecting unauthenticated search requests."""
    if current_user_id is None or not str(current_user_id).strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to search for roommates.",
        )
    return str(current_user_id).strip()
