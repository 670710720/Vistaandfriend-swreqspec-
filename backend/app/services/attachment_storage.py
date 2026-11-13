from __future__ import annotations

import os
from pathlib import Path
from uuid import UUID, uuid4


class AttachmentStorageError(Exception):
    """Reports storage failures without exposing filesystem details to API clients."""


class AttachmentStorage:
    """Stores attachment bytes behind a replaceable boundary for FR-CHAT-09/11/16."""

    def __init__(self, root: Path | str | None = None) -> None:
        self.root = Path(root or os.environ.get("CHAT_ATTACHMENT_STORAGE_DIR", "attachments"))

    def save(self, content: bytes) -> str:
        # FR-CHAT-09 and CON-CHAT-02: store bytes under a generated key, never a client path.
        storage_key = str(uuid4())
        try:
            self.root.mkdir(parents=True, exist_ok=True)
            self.path_for(storage_key).write_bytes(content)
        except OSError as error:
            raise AttachmentStorageError("Could not store attachment") from error
        return storage_key

    def path_for(self, storage_key: str) -> Path:
        try:
            safe_key = str(UUID(storage_key))
        except ValueError as error:
            raise AttachmentStorageError("Invalid attachment storage key") from error
        return self.root / safe_key

    def delete(self, storage_key: str) -> None:
        try:
            self.path_for(storage_key).unlink(missing_ok=True)
        except OSError as error:
            raise AttachmentStorageError("Could not remove attachment") from error
