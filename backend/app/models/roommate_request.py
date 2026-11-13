
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, Optional
import uuid

from app.validators.request_validator import validate_roommate_request_message_length

# รองรับ FR-RRS-05, FR-RRS-07, FR-RRS-14, CON-RRS-05, CON-RRS-10


def normalize_status(value: Optional[str]) -> str:
    """Normalize status strings for stored roommate requests."""
    if value is None:
        return "pending"

    mapping = {
        "pending": "pending",
        "รอการตอบรับ": "pending",
        "waiting": "pending",
        "accepted": "accepted",
        "ตอบรับ": "accepted",
        "rejected": "rejected",
        "ปฏิเสธ": "rejected",
        "cancelled": "cancelled",
        "ยกเลิก": "cancelled",
    }
    normalized = str(value).strip().lower()
    return mapping.get(normalized, normalized)


def normalize_receiver_status(value: Optional[str]) -> str:
    """Normalize receiver availability states used by validation."""
    if value is None:
        return "not_available"

    mapping = {
        "looking_for_roommate": "looking_for_roommate",
        "seeking_roommate": "looking_for_roommate",
        "searching": "looking_for_roommate",
        "available": "looking_for_roommate",
        "find_roommate": "looking_for_roommate",
        "หาเมท": "looking_for_roommate",
        "กำลังหาเมท": "looking_for_roommate",
        "not_available": "not_available",
        "notlookingforroommate": "not_available",
        "ไม่ได้หาเมท": "not_available",
    }
    normalized = str(value).strip().lower().replace(" ", "_")
    return mapping.get(normalized, normalized)


@dataclass
class RoommateRequest:
    """Represents a roommate request with the minimal data needed by T-01."""

    sender_id: str
    receiver_id: str
    status: str = "pending"
    message: str = ""
    receiver_status: Optional[str] = None
    notification_status: Optional[str] = None
    notification_error: Optional[str] = None
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def __post_init__(self) -> None:
        self.status = normalize_status(self.status)
        self.receiver_status = normalize_receiver_status(self.receiver_status)
        if self.notification_status is not None:
            self.notification_status = str(self.notification_status).strip().lower()
        self.message = str(self.message or "")
        self.validate_message_length(self.message)

    @staticmethod
    def validate_message_length(message: Optional[str] = None) -> None:
        validate_roommate_request_message_length(message)

    def validate(self) -> None:
        """Validate message length and stored request state."""
        self.validate_message_length(self.message)
        if not self.sender_id:
            raise ValueError("sender_id is required")
        if not self.receiver_id:
            raise ValueError("receiver_id is required")

    @classmethod
    def create(
        cls,
        sender_id: str,
        receiver_id: str,
        message: Optional[str] = None,
        status: str = "pending",
        receiver_status: Optional[str] = None,
    ) -> "RoommateRequest":
        instance = cls(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message=message,
            status=status,
            receiver_status=receiver_status,
        )
        instance.validate()
        return instance

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "status": self.status,
            "message": self.message,
            "receiver_status": self.receiver_status,
            "notification_status": self.notification_status,
            "notification_error": self.notification_error,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> "RoommateRequest":
        return cls(
            sender_id=payload["sender_id"],
            receiver_id=payload["receiver_id"],
            status=payload.get("status", "pending"),
            message=payload.get("message", ""),
            receiver_status=payload.get("receiver_status"),
            notification_status=payload.get("notification_status"),
            notification_error=payload.get("notification_error"),
            id=payload.get("id", str(uuid.uuid4())),
            created_at=datetime.fromisoformat(payload["created_at"]) if payload.get("created_at") else datetime.now(timezone.utc),
            updated_at=datetime.fromisoformat(payload["updated_at"]) if payload.get("updated_at") else datetime.now(timezone.utc),
        )
