from datetime import datetime
from typing import Any
from dateutil.parser import parse as parse_date
from sqlalchemy.orm import Session

from app.services.room_service import room_service


def run_room_booking_agent(
    db: Session,
    meeting_id: int,
    headcount: int,
    start_time_iso: str,
    end_time_iso: str,
    equipment_needed: list[str] | None = None,
) -> dict[str, Any]:
    """Standalone Room Booking Agent function.

    Finds available rooms matching headcount and equipment, selects the best match,
    and books the room for the meeting.
    """
    start_dt = parse_date(start_time_iso)
    end_dt = parse_date(end_time_iso)

    available_rooms = room_service.find_available_rooms(
        db=db,
        capacity_needed=headcount,
        start_time=start_dt,
        end_time=end_dt,
        required_equipment=equipment_needed,
    )

    if not available_rooms:
        return {
            "status": "failed",
            "message": f"No available room found matching headcount ({headcount}) and equipment requirements.",
            "room": None,
        }

    # Select room with capacity closest to headcount
    selected_room = min(available_rooms, key=lambda r: r.capacity)
    booked_room = room_service.book_room(
        db=db,
        meeting_id=meeting_id,
        room_id=selected_room.id,
        start_time=start_dt,
        end_time=end_dt,
    )

    return {
        "status": "booked",
        "message": f"Room '{booked_room.name}' successfully booked.",
        "room": {
            "id": booked_room.id,
            "name": booked_room.name,
            "capacity": booked_room.capacity,
            "equipment": booked_room.equipment,
        },
    }
