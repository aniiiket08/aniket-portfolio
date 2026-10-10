from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.db.models.room import Room

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.get("")
def list_rooms(db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    """List all available rooms."""
    rooms = db.query(Room).all()
    return [
        {"id": r.id, "name": r.name, "capacity": r.capacity, "equipment": r.equipment}
        for r in rooms
    ]
