from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.agents.room_booking import run_room_booking_agent
from app.agents.scheduling import run_scheduling_agent
from app.api.deps import get_current_user, get_db
from app.core.errors import NotFound
from app.db.models.meeting import Attendee, Meeting, MeetingStatus
from app.db.models.user import User
from app.db.schemas.meeting import MeetingConfirmRequest, MeetingCreate, MeetingResponse, SlotOption

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.post("", response_model=dict[str, Any])
def create_meeting_request(
    payload: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Create a meeting request and generate 3 ranked slots."""
    meeting = Meeting(
        title=payload.title,
        description=payload.description,
        duration_minutes=payload.duration_minutes,
        organizer_id=current_user.id,
        status=MeetingStatus.REQUESTED,
    )
    db.add(meeting)
    db.flush()

    # Link attendees
    all_emails = list(set(payload.attendee_emails + [current_user.email]))
    for email in all_emails:
        user = db.query(User).filter(User.email == email).first()
        if user:
            attendee = Attendee(meeting_id=meeting.id, user_id=user.id)
            db.add(attendee)

    meeting.status = MeetingStatus.SLOTS_PROPOSED
    db.commit()
    db.refresh(meeting)

    # Run Scheduling Agent
    slots = run_scheduling_agent(
        attendee_emails=all_emails,
        duration_minutes=payload.duration_minutes,
        target_date_iso=payload.target_date,
    )

    return {
        "meeting": MeetingResponse.model_validate(meeting),
        "slots": slots,
    }


@router.get("", response_model=list[MeetingResponse])
def list_meetings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Meeting]:
    """List all meetings in the system."""
    return db.query(Meeting).order_by(Meeting.created_at.desc()).all()


@router.get("/{meeting_id}/slots", response_model=list[SlotOption])
def get_meeting_slots(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict[str, Any]]:
    """Retrieve ranked candidate slots for a meeting."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise NotFound(entity="Meeting", identifier=meeting_id)

    attendee_emails = [a.user.email for a in meeting.attendees if a.user]
    if not attendee_emails:
        attendee_emails = [current_user.email]

    slots = run_scheduling_agent(
        attendee_emails=attendee_emails,
        duration_minutes=meeting.duration_minutes,
    )
    return slots


@router.post("/{meeting_id}/confirm", response_model=dict[str, Any])
def confirm_meeting_slot(
    meeting_id: int,
    payload: MeetingConfirmRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Confirm a slot and trigger room booking agent."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise NotFound(entity="Meeting", identifier=meeting_id)

    headcount = len(meeting.attendees) if meeting.attendees else 1

    # Run Room Booking Agent
    booking_result = run_room_booking_agent(
        db=db,
        meeting_id=meeting.id,
        headcount=headcount,
        start_time_iso=payload.selected_start_time,
        end_time_iso=payload.selected_end_time,
    )

    db.refresh(meeting)
    return {
        "meeting": MeetingResponse.model_validate(meeting),
        "room_booking": booking_result,
    }
