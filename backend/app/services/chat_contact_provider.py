from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
from typing import Protocol


DEMO_CURRENT_USER_ID = "demo-student-1"


@dataclass(frozen=True)
class ChatContact:
    id: str
    name: str


class ChatContactProvider(Protocol):
    """Production boundary for the contact list from UC-04 (FR-CHAT-01)."""

    def list_contacts(self, user_id: str) -> Sequence[ChatContact]:
        ...


class DevelopmentDemoProvider:
    """Development-only contact and eligibility data; it is not data from UC-04."""

    current_user_id = DEMO_CURRENT_USER_ID
    _contacts = (
        ChatContact(id="demo-student-2", name="ผู้ติดต่อสาธิต 1"),
        ChatContact(id="demo-student-3", name="ผู้ติดต่อสาธิต 2"),
    )

    def list_contacts(self, user_id: str) -> Sequence[ChatContact]:
        # FR-CHAT-01: expose sample contacts only to the fixed demo identity.
        if user_id != self.current_user_id:
            return ()
        return self._contacts

    def can_start_chat(self, sender_id: str, recipient_id: str) -> tuple[bool, str | None]:
        # FR-CHAT-12, CON-CHAT-01: allow only listed demo recipients.
        if sender_id != self.current_user_id:
            return False, "ผู้ส่งไม่ตรงกับผู้ใช้ในโหมดสาธิต"
        if not any(contact.id == recipient_id for contact in self._contacts):
            return False, "ผู้รับไม่อยู่ในรายชื่อสาธิต"
        return True, None

    def is_searchable(self, user_id: str) -> bool:
        # CON-CHAT-03: expose demo eligibility only for the fixed demo user and listed contacts.
        return user_id == self.current_user_id or any(
            contact.id == user_id for contact in self._contacts
        )
