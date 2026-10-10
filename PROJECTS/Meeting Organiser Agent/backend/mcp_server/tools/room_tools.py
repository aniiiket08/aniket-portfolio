from datetime import datetime
from typing import Any
from dateutil.parser import parse as parse_date
from sqlalchemy.orm import Session

from app.services.room_service import room_service


def find_rooms(
    db: Session,
    capacity: int,
    start_time_iso: str,
    end_time_iso: str,
    equipment: list[str] | None = None,
) -> list[dict[str, Any]]:
    """MCP tool: Search available rooms matching capacity and equipment."""
    start_dt = parse_date(start_time_iso)
    end_dt = parse_date(end_time_iso)
    rooms = room_service.find_available_rooms(db, capacity, start_dt, end_dt, equipment)

    return [
        {"id": r.id, "name": r.name, "capacity": r.capacity, "equipment": r.equipment}
        for r in rooms
    ]


def book_room(
    db: Session,
    meeting_id: int,
    room_id: int,
    start_time_iso: str,
    end_time_iso: str,
) -> dict[str, Any]:
    """MCP tool: Book a room with conflict checking."""
    start_dt = parse_date(start_time_iso)
    end_dt = parse_date(end_time_iso)
    room = room_service.book_room(db, meeting_id, room_id, start_dt, end_dt)
    return {"id": room.id, "name": room.name, "status": "booked"}
