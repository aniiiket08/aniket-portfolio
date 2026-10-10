from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.deps import get_db
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.models.room import Room
from app.db.models.user import User, UserRole
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    hashed = get_password_hash("password123")
    
    # Seed users and room
    users = [
        User(name="Admin User", email="admin@test.com", role=UserRole.ADMIN, hashed_password=hashed),
        User(name="Attendee One", email="attendee1@test.com", role=UserRole.ATTENDEE, hashed_password=hashed),
    ]
    room = Room(name="Conference Room A-101", capacity=10, equipment=["projector"])
    db.add_all(users + [room])
    db.commit()
    yield db
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="module")
def client(test_db):
    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_meeting_creation_and_slot_ranking(client):
    # Login first
    login_res = client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "password123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Post new meeting request
    create_res = client.post(
        "/api/v1/meetings",
        json={
            "title": "Quarterly Strategy Sync",
            "description": "Discuss Q4 objectives and budget",
            "duration_minutes": 60,
            "attendee_emails": ["attendee1@test.com"],
        },
        headers=headers,
    )
    assert create_res.status_code == 200
    data = create_res.json()
    assert "meeting" in data
    assert "slots" in data
    assert len(data["slots"]) == 3
    assert "reason" in data["slots"][0]


def test_confirm_slot_and_room_booking(client):
    # Login
    login_res = client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "password123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create meeting
    create_res = client.post(
        "/api/v1/meetings",
        json={
            "title": "Room Booking Test Sync",
            "duration_minutes": 60,
            "attendee_emails": ["attendee1@test.com"],
        },
        headers=headers,
    )
    meeting_id = create_res.json()["meeting"]["id"]
    slots = create_res.json()["slots"]

    # Confirm slot
    confirm_res = client.post(
        f"/api/v1/meetings/{meeting_id}/confirm",
        json={
            "selected_start_time": slots[0]["start_time"],
            "selected_end_time": slots[0]["end_time"],
        },
        headers=headers,
    )
    assert confirm_res.status_code == 200
    confirm_data = confirm_res.json()
    assert confirm_data["meeting"]["status"] == "room_booked"
    assert confirm_data["room_booking"]["status"] == "booked"
    assert confirm_data["room_booking"]["room"]["name"] == "Conference Room A-101"
