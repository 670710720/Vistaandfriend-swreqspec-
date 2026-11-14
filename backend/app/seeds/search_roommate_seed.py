from __future__ import annotations

import json
from pathlib import Path

from app.services.search_roommate import SearchRoommateProfile


def load_seed_profiles() -> list[SearchRoommateProfile]:
    """Support CON-SRS-03, CON-SRS-04, CON-SRS-06, CON-SRS-07, CON-SRS-08 with a sample dataset."""
    data_file = Path(__file__).resolve().parent.parent / "data" / "sample_roommate_profiles.json"
    payload = json.loads(data_file.read_text(encoding="utf-8"))
    return [SearchRoommateProfile(**item) for item in payload]
