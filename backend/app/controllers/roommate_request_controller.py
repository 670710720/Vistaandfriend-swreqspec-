from __future__ import annotations

from typing import Optional

from app.models.roommate_request import RoommateRequest
from app.services.request_roommate_service import RequestRoommateService


class RoommateRequestController:
    """Thin controller for submitting roommate requests while keeping save and notification separate."""

    def __init__(self, service: Optional[RequestRoommateService] = None) -> None:
        self.service = service or RequestRoommateService()

    def submit_request(
        self,
        sender_id: str,
        receiver_id: str,
        message: Optional[str] = None,
        receiver_status: Optional[str] = None,
        profile_id: Optional[str] = None,
    ) -> RoommateRequest:
        return self.service.submit_request(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message=message,
            receiver_status=receiver_status,
            profile_id=profile_id,
        )
