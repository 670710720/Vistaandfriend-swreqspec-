from __future__ import annotations

from typing import Callable, Optional


class RequestGuard:
    """Guard conditions for request submission.

    This is intentionally contract-based: the real authentication/profile systems live
    outside this feature and must be supplied by the owning feature modules. The
    guard itself never fabricates user or profile data.
    """

    @staticmethod
    def ensure_authenticated(sender_id: Optional[str], auth_checker: Optional[Callable[[Optional[str]], bool]] = None) -> None:
        # รองรับ CON-RRS-01, NFR-RRS-01
        if sender_id is None or str(sender_id).strip() == "":
            raise ValueError("นักศึกษาไม่ได้เข้าสู่ระบบ")
        if auth_checker is not None and not auth_checker(sender_id):
            raise ValueError("นักศึกษาไม่ได้เข้าสู่ระบบ")

    @staticmethod
    def ensure_not_self_request(sender_id: str, receiver_id: str) -> None:
        # รองรับ CON-RRS-08, FR-RRS-10
        if sender_id == receiver_id:
            raise ValueError("ไม่สามารถส่งคำขอเป็นเมทให้ตนเองได้")

    @staticmethod
    def ensure_profile_exists(
        profile_id: Optional[str],
        profile_checker: Optional[Callable[[Optional[str]], bool]] = None,
    ) -> None:
        # รองรับ CON-RRS-02, AC-RRS-12
        if profile_id is None or str(profile_id).strip() == "":
            raise ValueError("ยังไม่มีโปรไฟล์หาเมท")
        if profile_checker is not None and not profile_checker(profile_id):
            raise ValueError("ยังไม่มีโปรไฟล์หาเมท")
