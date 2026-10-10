import logging
from sqlalchemy.orm import Session

from app.core.logging import setup_logging
from app.db.base import Base
from app.db.models.audit import AuditLog
from app.db.models.room import Room
from app.db.models.user import User, UserRole
from app.db.session import SessionLocal, engine

logger = setup_logging()


def seed_db(db: Session) -> None:
    """Seed initial users, rooms, and audit entry."""
    Base.metadata.create_all(bind=engine)

    # Seed users if empty
    if not db.query(User).first():
        # Dummy hashed password for seed users (real auth password verification in P1-T4)
        dummy_hash = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW"  # 'password123'
        users = [
            User(name="Admin User", email="admin@meetingorganizer.internal", role=UserRole.ADMIN, hashed_password=dummy_hash),
            User(name="Coordinator User", email="coordinator@meetingorganizer.internal", role=UserRole.COORDINATOR, hashed_password=dummy_hash),
            User(name="Approver Chair", email="approver@meetingorganizer.internal", role=UserRole.APPROVER, hashed_password=dummy_hash),
            User(name="Attendee One", email="attendee1@meetingorganizer.internal", role=UserRole.ATTENDEE, hashed_password=dummy_hash),
            User(name="Attendee Two", email="attendee2@meetingorganizer.internal", role=UserRole.ATTENDEE, hashed_password=dummy_hash),
        ]
        db.add_all(users)
        logger.info("Seeded %d initial users.", len(users))

    # Seed rooms if empty
    if not db.query(Room).first():
        rooms = [
            Room(name="Conference Room A-101", capacity=10, equipment=["projector", "whiteboard"]),
            Room(name="Boardroom B-204", capacity=20, equipment=["projector", "mic", "video_conf"]),
            Room(name="Seminar Hall C", capacity=50, equipment=["projector", "mic", "speakers", "stage"]),
        ]
        db.add_all(rooms)
        logger.info("Seeded %d initial rooms.", len(rooms))

    # Seed initial audit log entry
    if not db.query(AuditLog).first():
        audit = AuditLog(
            actor="system",
            action="seed",
            entity="database",
            details={"message": "Initial database seed completed"},
        )
        db.add(audit)

    db.commit()
    logger.info("Database seeding completed successfully.")


if __name__ == "__main__":
    with SessionLocal() as db_session:
        seed_db(db_session)
