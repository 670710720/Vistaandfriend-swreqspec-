from __future__ import annotations

from typing import Iterable, List, Optional

from app.models.roommate_request import RoommateRequest


class RoommateRequestRepository:
    """Repository contract for request lookup and persistence.

    The project does not yet expose a real profile or match data contract, so this
    repository intentionally stores only request-domain records and exposes the
    minimal read/write operations required by T-03.
    """

    def __init__(self, requests: Optional[Iterable[RoommateRequest]] = None) -> None:
        self._requests: List[RoommateRequest] = list(requests or [])

    def list(self) -> List[RoommateRequest]:
        return list(self._requests)

    def add(self, request: RoommateRequest) -> RoommateRequest:
        self._requests.append(request)
        return request

    def find_pending_by_sender_receiver(
        self, sender_id: str, receiver_id: str
    ) -> List[RoommateRequest]:
        return [
            request
            for request in self._requests
            if request.sender_id == sender_id
            and request.receiver_id == receiver_id
            and request.status == "pending"
        ]

    def find_pending_by_receiver(self, receiver_id: str) -> List[RoommateRequest]:
        return [
            request
            for request in self._requests
            if request.receiver_id == receiver_id and request.status == "pending"
        ]


class InMemoryRoommateRequestRepository(RoommateRequestRepository):
    """Simple in-memory implementation used until the real backend store is wired."""

    pass
