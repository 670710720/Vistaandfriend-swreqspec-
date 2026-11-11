from __future__ import annotations

from typing import Any, Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field

from app.middleware.auth_guard import require_authenticated_user
from app.services.search_roommate import SearchRoommateProfile, SearchRoommateService

app = FastAPI(title="Search Roommate API")
service = SearchRoommateService()


class SearchRoommateRequest(BaseModel):
    current_user_id: str = Field(..., description="Authenticated student identifier")
    filters: dict[str, Any] = Field(default_factory=dict)
    mode: Literal["AND", "OR"] = "AND"
    page: int = Field(1, ge=1, description="Result page number, starting from 1")


class SearchRoommateResponse(BaseModel):
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

    @classmethod
    def from_profile(cls, profile: SearchRoommateProfile) -> "SearchRoommateResponse":
        return cls(**profile.__dict__)


@app.post("/search-roommates", response_model=list[SearchRoommateResponse])
def search_roommates(request: SearchRoommateRequest) -> list[SearchRoommateResponse]:
    """Support FR-SRS-04, FR-SRS-05, FR-SRS-08, FR-SRS-09, CON-SRS-03, CON-SRS-04, CON-SRS-01, NFR-SRS-01."""
    current_user_id = require_authenticated_user(request.current_user_id)
    results = service.query_roommates(
        current_user_id=current_user_id,
        filters=request.filters,
        mode=request.mode,
        page=request.page,
    )
    return [SearchRoommateResponse.from_profile(profile) for profile in results]
