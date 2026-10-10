from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr
from app.db.models.meeting import MeetingStatus, RSVPStatus


class MeetingCreate(BaseModel):
    title: str
    description: str | None = None
    duration_minutes: int = 60
    target_date: str | None = None
    attendee_emails: list[EmailStr]
    equipment_needed: list[str] | None = None


class SlotOption(BaseModel):
    slot_index: int
    start_time: str
    end_time: str
    score: float
    reason: str
    conflicts: list[str]


class MeetingConfirmRequest(BaseModel):
    selected_start_time: str
    selected_end_time: str
    room_id: int | None = None


class MeetingResponse(BaseModel):
    id: int
    title: str
    description: str | None
    duration_minutes: int
    start_time: datetime | None
    end_time: datetime | None
    organizer_id: int
    room_id: int | None
    status: MeetingStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
