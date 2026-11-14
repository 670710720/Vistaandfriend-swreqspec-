from __future__ import annotations

from typing import Optional

from app.config import MAX_ROOMMATE_REQUEST_MESSAGE_LENGTH


# รองรับ CON-RRS-10, FR-RRS-14
def validate_roommate_request_message_length(message: Optional[str]) -> None:
    candidate = "" if message is None else str(message)
    if len(candidate) > MAX_ROOMMATE_REQUEST_MESSAGE_LENGTH:
        raise ValueError(
            f"ข้อความประกอบต้องไม่เกิน {MAX_ROOMMATE_REQUEST_MESSAGE_LENGTH} ตัวอักษร"
        )
