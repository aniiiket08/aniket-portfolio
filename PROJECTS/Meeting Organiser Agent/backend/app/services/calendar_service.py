from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any
from dateutil.parser import parse as parse_date

MOCK_CALENDAR_PATH = Path(__file__).resolve().parent.parent.parent.parent / "data" / "mock_calendar.json"


class CalendarService:
    """Service to interact with attendee calendars (Mock JSON implementation first)."""

    def __init__(self, data_path: Path = MOCK_CALENDAR_PATH):
        self.data_path = data_path

    def _load_mock_data(self) -> dict[str, list[dict[str, Any]]]:
        if not self.data_path.exists():
            return {}
        with open(self.data_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def get_busy_slots(self, emails: list[str]) -> dict[str, list[dict[str, datetime]]]:
        """Fetch busy events for each email address."""
        raw_data = self._load_mock_data()
        result: dict[str, list[dict[str, datetime]]] = {}

        for email in emails:
            events = raw_data.get(email, [])
            busy_list = []
            for ev in events:
                start_dt = parse_date(ev["start"])
                end_dt = parse_date(ev["end"])
                if start_dt.tzinfo is None:
                    start_dt = start_dt.replace(tzinfo=timezone.utc)
                if end_dt.tzinfo is None:
                    end_dt = end_dt.replace(tzinfo=timezone.utc)
                busy_list.append({"start": start_dt, "end": end_dt, "title": ev.get("title", "Busy")})
            result[email] = busy_list

        return result


calendar_service = CalendarService()
