from dataclasses import dataclass, field
from datetime import datetime, time, timedelta, timezone
from typing import Sequence


@dataclass
class SlotCandidate:
    start_time: datetime
    end_time: datetime
    score: float = 0.0
    reason: str = ""
    conflicts: list[str] = field(default_factory=list)


@dataclass
class AttendeeSchedule:
    email: str
    is_priority: bool = False
    busy_slots: list[dict[str, datetime]] = field(default_factory=list)


def score_slot_candidates(
    candidates: Sequence[SlotCandidate],
    schedules: Sequence[AttendeeSchedule],
    preferred_start_hour: int = 9,
    preferred_end_hour: int = 17,
) -> list[SlotCandidate]:
    """Pure function to score and rank meeting slot candidates.

    Scoring criteria:
    - Base score: 100.0
    - Non-priority attendee conflict penalty: -30.0 per conflict
    - Priority attendee conflict penalty: -60.0 per conflict
    - Outside preferred working hours (9 AM - 5 PM): -25.0
    - Back-to-back conflict (busy event starts/ends right at candidate boundary): -10.0
    """
    scored_slots: list[SlotCandidate] = []

    for candidate in candidates:
        score = 100.0
        reasons: list[str] = []
        conflicts: list[str] = []
        back_to_back_count = 0
        free_count = 0
        total_attendees = len(schedules)

        for sched in schedules:
            has_conflict = False
            has_b2b = False

            for busy in sched.busy_slots:
                b_start = busy["start"]
                b_end = busy["end"]

                # Check overlap: candidate start < busy end AND candidate end > busy start
                if candidate.start_time < b_end and candidate.end_time > b_start:
                    has_conflict = True
                    conflicts.append(sched.email)
                    penalty = 60.0 if sched.is_priority else 30.0
                    score -= penalty
                    break

                # Check back-to-back: busy ends right when candidate starts, or starts when candidate ends
                if candidate.start_time == b_end or candidate.end_time == b_start:
                    has_b2b = True

            if not has_conflict:
                free_count += 1
            if has_b2b:
                back_to_back_count += 1
                score -= 10.0

        # Working hours check (local time)
        local_start_hour = candidate.start_time.hour
        local_end_hour = candidate.end_time.hour
        if local_start_hour < preferred_start_hour or local_end_hour > preferred_end_hour:
            score -= 25.0
            reasons.append("outside preferred hours")

        # Synthesize one-line editorial reasoning
        day_str = candidate.start_time.strftime("%a")
        time_str = candidate.start_time.strftime("%I:%M %p").lstrip("0")
        
        if free_count == total_attendees:
            attendee_reason = f"all {total_attendees} free"
        else:
            attendee_reason = f"{free_count} of {total_attendees} free"

        if back_to_back_count == 0:
            b2b_reason = "no back-to-back"
        else:
            b2b_reason = f"{back_to_back_count} back-to-back"

        reasons_combined = ", ".join([attendee_reason, b2b_reason] + reasons)
        reason_text = f"{day_str} {time_str}: {reasons_combined}"

        scored_slots.append(
            SlotCandidate(
                start_time=candidate.start_time,
                end_time=candidate.end_time,
                score=round(score, 1),
                reason=reason_text,
                conflicts=conflicts,
            )
        )

    # Sort descending by score, then ascending by start time
    scored_slots.sort(key=lambda s: (-s.score, s.start_time))
    return scored_slots
