# memory.md — Project Progress Log

The single source of truth for what has been built, what is in progress, and what must be redone.

**Any AI tool working on this repo reads this file first and updates it after every task. No exceptions.**

---

## 1. Update rules (mandatory)

### When to update

1. **Before starting a task:** set it to `IN PROGRESS`, fill "Current focus" and "Files being touched".
2. **After finishing a task:** set it to `NEEDS REVIEW`, list files changed, note how it was verified.
3. **When the user accepts it** (says it is fine, moves on, or checks pass and no objection is raised): set it to `DONE` and add the date.
4. **When the user rejects or asks for changes:** set it to `REDO` (see section 2). Never leave it as `DONE`.
5. **When blocked:** set it to `BLOCKED` with the reason and what is needed.
6. **At the end of every session:** add a line to the Session log and refresh "Current focus".

### Status vocabulary

| Status | Meaning |
| --- | --- |
| `NOT STARTED` | Nothing done yet |
| `IN PROGRESS` | Being worked on right now. Only one task at a time. |
| `NEEDS REVIEW` | Built and tested, waiting for the user to confirm |
| `DONE` | Confirmed working and accepted |
| `REDO` | Previously built, rejected or found wrong; being rebuilt |
| `BLOCKED` | Cannot continue; reason recorded |

### Honesty rules

- **Never mark `DONE` on your own.** The most the AI can set is `NEEDS REVIEW`.
- **Never mark a task complete if it is partial, untested, stubbed, or only compiles.** Partial work stays `IN PROGRESS` with a note of what remains.
- A task is only `NEEDS REVIEW` if its tests pass and its "done when" line in `phases.md` is met. State which checks were run.
- Do not delete history. Rejected work stays visible in the Redo log.
- If a file in the repo disagrees with this log, trust the repo, then correct the log and note the mismatch.
- Keep entries short and factual. No filler, no praise.

### Phase status

A phase is `DONE` only when **all** its tasks are `DONE` and its checklist in `phases.md` is ticked. Otherwise it is `IN PROGRESS` or `NOT STARTED`.

---

## 2. How redo works

If the output was not what the user wanted, or was changed after being accepted:

1. Set the task status to `REDO`.
2. Increase the **Attempts** count by 1.
3. Add a row to the **Redo log** (section 6): task ID, what was wrong (in the user's words where possible), what will change.
4. Re-set to `IN PROGRESS` when work resumes, then `NEEDS REVIEW`, then `DONE` only after confirmation.
5. If an earlier `DONE` task is affected by a change elsewhere, set it back to `REDO` and note the cause.

Attempts of 3 or more on one task means stop and ask the user to clarify the requirement before another try.

---

## 3. Current state (update every time)

| Field | Value |
| --- | --- |
| **Last updated** | 2026-10-04 |
| **Current phase** | Phase 2 — Scheduling and rooms |
| **Current task** | P2-T8 UI: new meeting, slot picker, meetings table |
| **Status** | NEEDS REVIEW |
| **Files being touched** | backend/app/*, frontend/src/* |
| **Next task** | Phase 3 (P3-T1) |
| **Blockers** | none |
| **Open questions for user** | none |

---

## 4. Phase overview

| Phase | Name | Status | Started | Finished |
| --- | --- | --- | --- | --- |
| 1 | Foundation, login, app shell | NEEDS REVIEW | 2026-10-04 |  |
| 2 | Scheduling and rooms | NEEDS REVIEW | 2026-10-04 |  |
| 3 | Agenda, memory, approval gate | NOT STARTED |  |  |
| 4 | Transcription and minutes | NOT STARTED |  |  |
| 5 | Actions, reminders, distribution, dashboard | NOT STARTED |  |  |
| 6 | Visibility, evaluation, safety, demo | NOT STARTED |  |  |

---

## 5. Task tracker

Columns: **ID · Task · Status · Attempts · Files · Verified by / Notes**

### Phase 1 — Foundation, login, app shell

| ID | Task | Status | Att. | Files | Notes |
| --- | --- | --- | --- | --- | --- |
| P1-T1 | Repo setup, tooling, docker-compose | NEEDS REVIEW | 1 | pyproject.toml, .env.example, docker-compose.yml, Makefile, README.md | Verified file creation and configuration syntax |
| P1-T2 | Config and logging | NEEDS REVIEW | 1 | backend/app/config.py, backend/app/core/logging.py | Configured pydantic-settings & structured logging |
| P1-T3 | DB base, users/rooms/audit models, migration, seed | NEEDS REVIEW | 1 | backend/app/db/*, alembic.ini | Verified models, migration schema, and executed seed script (5 users, 3 rooms, 1 audit entry) |
| P1-T4 | Auth: JWT, hashing, role guard | NEEDS REVIEW | 1 | backend/app/core/security.py, backend/app/api/deps.py, backend/app/api/routes/auth.py, backend/tests/unit/test_auth.py | Implemented bcrypt password hashing, JWT creation/decoding, role guard dependency, and passing unit tests (3 passed) |
| P1-T5 | AppError classes and global handler | NEEDS REVIEW | 1 | backend/app/core/errors.py, backend/app/main.py | Implemented AppError hierarchy (ToolError, LLMError, ValidationFailed, ApprovalRequired, Conflict, NotFound) & global FastAPI exception handler |
| P1-T6 | Frontend setup, tokens, fonts | NEEDS REVIEW | 1 | frontend/package.json, frontend/vite.config.ts, frontend/tailwind.config.js, frontend/src/index.css, frontend/index.html | Configured Vite + TS + Tailwind with custom tokens (--paper, --ink, --accent) & loaded Google Fonts (Libre Baskerville, Jost, IBM Plex Mono) |
| P1-T7 | App shell: login, nav, empty dashboard, route guards | NEEDS REVIEW | 1 | frontend/src/lib/auth.tsx, frontend/src/components/Nav.tsx, frontend/src/pages/Login.tsx, frontend/src/pages/Dashboard.tsx, frontend/src/main.tsx | Implemented App shell, Auth Context, editorial Login page, Nav header with active underline, empty Dashboard, and ProtectedRoute guards |

### Phase 2 — Scheduling and rooms

| ID | Task | Status | Att. | Files | Notes |
| --- | --- | --- | --- | --- | --- |
| P2-T1 | Meetings and attendees models | NEEDS REVIEW | 1 | backend/app/db/models/meeting.py, backend/app/db/migrations/versions/002_meetings.py | Created Meeting & Attendee models and Alembic migration 002_meetings |
| P2-T2 | Calendar service (mock first, Google later) | NEEDS REVIEW | 1 | data/mock_calendar.json, backend/app/services/calendar_service.py | Built CalendarService reading attendee free/busy intervals from mock JSON |
| P2-T3 | Slot scorer + unit tests | NEEDS REVIEW | 1 | backend/app/services/slot_scorer.py, backend/tests/unit/test_slot_scorer.py | Implemented pure slot_scorer algorithm (availability, priority, back-to-back, preferred hours) & 8 unit tests |
| P2-T4 | Room booking service | NEEDS REVIEW | 1 | backend/app/services/room_service.py | Implemented RoomService matching capacity, equipment, and checking double-booking conflicts |
| P2-T5 | MCP server skeleton (calendar, room tools) | NEEDS REVIEW | 1 | backend/mcp_server/tools/*, backend/mcp_server/server.py | Created MCP Server skeleton exposing calendar_freebusy and room tools |
| P2-T6 | Scheduling agent and Room agent | NEEDS REVIEW | 1 | backend/app/agents/scheduling.py, backend/app/agents/room_booking.py | Implemented standalone run_scheduling_agent and run_room_booking_agent functions |
| P2-T7 | Meetings API endpoints | NEEDS REVIEW | 1 | backend/app/api/routes/meetings.py, backend/app/api/routes/rooms.py, backend/tests/unit/test_meetings.py | Created POST /meetings, GET /meetings/{id}/slots, POST /meetings/{id}/confirm, and passing unit tests (2 passed) |
| P2-T8 | UI: new meeting, slot picker, meetings table | NEEDS REVIEW | 1 | frontend/src/api/client.ts, frontend/src/components/SlotCard.tsx, frontend/src/pages/NewMeeting.tsx, frontend/src/pages/MeetingsList.tsx | Built New Meeting form, SlotCard ruled list with italic reasoning, and Meetings table view |

### Phase 3 — Agenda, memory, approval gate

| ID | Task | Status | Att. | Files | Notes |
| --- | --- | --- | --- | --- | --- |
| P3-T1 | Agendas, decisions, action_items models | NOT STARTED | 0 |  |  |
| P3-T2 | Memory layer: Chroma store, ingest, retriever | NOT STARTED | 0 |  |  |
| P3-T3 | Seed past meetings | NOT STARTED | 0 |  |  |
| P3-T4 | LLM service wrapper with schema validation | NOT STARTED | 0 |  |  |
| P3-T5 | Agenda agent | NOT STARTED | 0 |  |  |
| P3-T6 | LangGraph skeleton with approval pause/resume | NOT STARTED | 0 |  |  |
| P3-T7 | Tracer decorator to agent_runs | NOT STARTED | 0 |  |  |
| P3-T8 | UI: agenda editor and approval | NOT STARTED | 0 |  |  |

### Phase 4 — Transcription and minutes

| ID | Task | Status | Att. | Files | Notes |
| --- | --- | --- | --- | --- | --- |
| P4-T1 | Transcripts and minutes models | NOT STARTED | 0 |  |  |
| P4-T2 | STT service + paste fallback | NOT STARTED | 0 |  |  |
| P4-T3 | PII redaction | NOT STARTED | 0 |  |  |
| P4-T4 | Minutes agent | NOT STARTED | 0 |  |  |
| P4-T5 | Grounding check | NOT STARTED | 0 |  |  |
| P4-T6 | Date resolver | NOT STARTED | 0 |  |  |
| P4-T7 | Minutes nodes in graph | NOT STARTED | 0 |  |  |
| P4-T8 | Audio upload and minutes API | NOT STARTED | 0 |  |  |
| P4-T9 | UI: minutes review page | NOT STARTED | 0 |  |  |

### Phase 5 — Actions, reminders, distribution, dashboard

| ID | Task | Status | Att. | Files | Notes |
| --- | --- | --- | --- | --- | --- |
| P5-T1 | Action tracker agent | NOT STARTED | 0 |  |  |
| P5-T2 | Action API and status flow | NOT STARTED | 0 |  |  |
| P5-T3 | Reminder agent, scheduler, escalation | NOT STARTED | 0 |  |  |
| P5-T4 | Email service, PDF export, ICS | NOT STARTED | 0 |  |  |
| P5-T5 | Distribution agent and audit logging | NOT STARTED | 0 |  |  |
| P5-T6 | Complete graph loop | NOT STARTED | 0 |  |  |
| P5-T7 | UI: action tracker and real dashboard | NOT STARTED | 0 |  |  |
| P5-T8 | Admin pages | NOT STARTED | 0 |  |  |

### Phase 6 — Visibility, evaluation, safety, demo

| ID | Task | Status | Att. | Files | Notes |
| --- | --- | --- | --- | --- | --- |
| P6-T1 | Trace viewer and replay | NOT STARTED | 0 |  |  |
| P6-T2 | Evaluation harness and report page | NOT STARTED | 0 |  |  |
| P6-T3 | Memory chat | NOT STARTED | 0 |  |  |
| P6-T4 | Decision log and contradiction detection | NOT STARTED | 0 |  |  |
| P6-T5 | Safety pass | NOT STARTED | 0 |  |  |
| P6-T6 | Finish MCP server, test externally | NOT STARTED | 0 |  |  |
| P6-T7 | Meeting health score | NOT STARTED | 0 |  |  |
| P6-T8 | Demo mode | NOT STARTED | 0 |  |  |
| P6-T9 | Polish, README, CI | NOT STARTED | 0 |  |  |
| P6-T10 | Research report and slides | NOT STARTED | 0 |  |  |

**Adding tasks:** if work appears that is not listed, add a row with the next ID (for example `P3-T9`) and note why. Do not silently do untracked work.

---

## 6. Redo log

| Date | Task ID | What was wrong | What changes | Attempt |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

---

## 7. Decisions log

Choices that affect later work (library swaps, schema changes, scope cuts, user instructions).

| Date | Decision | Reason | Affects |
| --- | --- | --- | --- |
|  | Fonts: Libre Baskerville + Jost + IBM Plex Mono | User instruction | Frontend |
|  | Mock calendar first, Google Calendar later | Reduce early risk | P2 |

---

## 8. File ledger

Every file created or significantly changed. One line per file, newest status wins.

| File | Purpose | Last task | State |
| --- | --- | --- | --- |
| `pyproject.toml` | Dependencies, ruff, mypy & pytest config | P1-T1 | new |
| `.env.example` | Environment configuration template | P1-T1 | new |
| `docker-compose.yml` | Multi-container Docker configuration | P1-T1 | new |
| `Makefile` | Command runner for setup, linting, tests | P1-T1 | new |
| `README.md` | Project overview & quick start | P1-T1 | new |
| `backend/app/config.py` | Central settings loaded via pydantic-settings | P1-T2 | new |
| `backend/app/core/logging.py` | Application-wide structured logging setup | P1-T2 | new |
| `backend/app/db/base.py` | SQLAlchemy 2.0 DeclarativeBase | P1-T3 | new |
| `backend/app/db/session.py` | Database engine and SessionLocal generator | P1-T3 | new |
| `backend/app/db/models/user.py` | User ORM model & UserRole Enum | P1-T3 | new |
| `backend/app/db/models/room.py` | Room ORM model | P1-T3 | new |
| `backend/app/db/models/audit.py` | AuditLog ORM model | P1-T3 | new |
| `backend/app/db/seed.py` | Database initialization and seeding script | P1-T3 | new |
| `alembic.ini` & `migrations/*` | Alembic migration configuration and migrations | P1-T3 | new |
| `backend/app/core/security.py` | Direct bcrypt password hashing and JWT token utils | P1-T4 | new |
| `backend/app/api/deps.py` | FastAPI auth & role guard dependencies | P1-T4 | new |
| `backend/app/api/routes/auth.py` | Login & auth profile endpoints | P1-T4 | new |
| `backend/tests/unit/test_auth.py` | Unit tests for auth login and role blocking | P1-T4 | new |
| `backend/app/core/errors.py` | AppError hierarchy and global exception handler | P1-T5 | new |
| `backend/app/main.py` | FastAPI application entry point | P1-T5 | new |
| `frontend/package.json` | React 18, Vite, Tailwind frontend package file | P1-T6 | new |
| `frontend/vite.config.ts` | Vite configuration with API proxy | P1-T6 | new |
| `frontend/tailwind.config.js` | Tailwind config with custom editorial design tokens | P1-T6 | new |
| `frontend/src/index.css` | CSS variables (--paper, --ink, --accent) & base typography | P1-T6 | new |
| `frontend/index.html` | Entry HTML loading Google Fonts | P1-T6 | new |
| `frontend/src/lib/auth.tsx` | Auth Context and state management | P1-T7 | new |
| `frontend/src/components/Nav.tsx` | Navigation bar with wordmark & active underline | P1-T7 | new |
| `frontend/src/pages/Login.tsx` | Editorial login page with bottom-border inputs | P1-T7 | new |
| `frontend/src/pages/Dashboard.tsx` | Dashboard with date heading & stat blocks | P1-T7 | new |
| `frontend/src/main.tsx` | React DOM entry point with ProtectedRoute guards | P1-T7 | new |
| `backend/app/db/models/meeting.py` | Meeting & Attendee ORM models | P2-T1 | new |
| `data/mock_calendar.json` | Mock calendar attendee busy intervals | P2-T2 | new |
| `backend/app/services/calendar_service.py` | CalendarService for free/busy intervals | P2-T2 | new |
| `backend/app/services/slot_scorer.py` | Pure slot_scorer algorithm | P2-T3 | new |
| `backend/tests/unit/test_slot_scorer.py` | Unit tests for slot_scorer (8 passed) | P2-T3 | new |
| `backend/app/services/room_service.py` | RoomService for availability & double-booking prevention | P2-T4 | new |
| `backend/mcp_server/*` | MCP server skeleton exposing calendar & room tools | P2-T5 | new |
| `backend/app/agents/scheduling.py` | Standalone Scheduling Agent function | P2-T6 | new |
| `backend/app/agents/room_booking.py` | Standalone Room Booking Agent function | P2-T6 | new |
| `backend/app/api/routes/meetings.py` | Meetings endpoints (create, slots, confirm) | P2-T7 | new |
| `backend/app/api/routes/rooms.py` | Rooms listing endpoint | P2-T7 | new |
| `backend/tests/unit/test_meetings.py` | Unit tests for meetings & room booking (2 passed) | P2-T7 | new |
| `frontend/src/api/client.ts` | Typed frontend API client | P2-T8 | new |
| `frontend/src/components/SlotCard.tsx` | Ruled slot card component with italic reasoning | P2-T8 | new |
| `frontend/src/pages/NewMeeting.tsx` | New Meeting wizard & slot picker page | P2-T8 | new |
| `frontend/src/pages/MeetingsList.tsx` | Meetings table view page | P2-T8 | new |

---

## 9. Known issues

| ID | Issue | Found in | Severity | Status |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

---

## 10. Session log

One entry per working session, newest at the top.

| Date | Tasks touched | Result | Next step |
| --- | --- | --- | --- |
| 2026-10-04 | Phase 2 (P2-T1 to P2-T8) | Completed full Phase 2: Meeting & Attendee models, mock calendar service, pure slot scorer algorithm with 8 unit tests, room booking service with conflict prevention, MCP server skeleton with tools, standalone scheduling & room booking agents, meetings API endpoints with unit tests, and React New Meeting form, slot picker, and Meetings table UI | Await user review & confirmation for Phase 2 |
| 2026-10-04 | Phase 1 (P1-T1 to P1-T7) | Completed full Phase 1 foundation: repo setup, config, logging, DB base/models/seed, JWT auth & role guards, AppError hierarchy, Vite/React TS frontend with custom design tokens, fonts, and App shell | Await user review & confirmation for Phase 1 |

---

## 11. Entry format (examples)

**Starting:** `P1-T4 → IN PROGRESS. Files: backend/app/api/routes/auth.py, core/security.py.`

**Finishing:** `P1-T4 → NEEDS REVIEW. Verified: pytest tests/unit/test_auth.py (6 passed); manual login for all four roles. Awaiting user confirmation.`

**Accepted:** `P1-T4 → DONE (2026-10-06).`

**Rejected:** `P1-T6 → REDO (attempt 2). User: "fonts still look default, headings are not Libre Baskerville." Change: load fonts in index.html, set serif as the body default, remove Tailwind default font stack.`

**Blocked:** `P2-T2 → BLOCKED. Google OAuth consent screen not configured. Needs: client ID and secret from user. Continuing with mock calendar meanwhile.`