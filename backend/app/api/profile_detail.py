from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from app.middleware.auth_guard import require_authenticated_user
from app.services.profile_detail import ProfileDetailService

app = FastAPI(title="Profile Detail API")
service = ProfileDetailService()


class ProfileDetailResponse(BaseModel):
    user_id: str
    name: str
    age: int
    gender: str
    faculty: str
    academic_year: str
    room_type: str
    room_size: int
    is_open_for_search: bool = True
    sleep_behavior: str | None = None
    cleanliness: str | None = None
    sleep_time: str | None = None
    social_links: dict[str, str] = Field(default_factory=dict)
    phone_number: str | None = None


@app.get("/profile-detail/{profile_user_id}", response_model=ProfileDetailResponse)
def get_profile_detail(profile_user_id: str, current_user_id: str) -> ProfileDetailResponse:
    """Support FR-SRS-06 and CON-SRS-06 by returning approved detail data for an eligible profile."""
    current_user = require_authenticated_user(current_user_id)
    try:
        detail = service.get_profile_detail(current_user, profile_user_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return ProfileDetailResponse(**detail)
