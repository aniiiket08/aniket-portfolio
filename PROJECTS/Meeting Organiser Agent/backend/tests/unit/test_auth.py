from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.api.deps import get_db
from app.db.base import Base
from app.db.models.user import User, UserRole
from app.main import app

from sqlalchemy.pool import StaticPool

# In-memory SQLite DB for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


from app.core.security import get_password_hash

@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    hashed = get_password_hash("password123")
    # Create test users for roles
    users = [
        User(name="Test Admin", email="admin@test.com", role=UserRole.ADMIN, hashed_password=hashed),
        User(name="Test Coord", email="coord@test.com", role=UserRole.COORDINATOR, hashed_password=hashed),
        User(name="Test Attendee", email="attendee@test.com", role=UserRole.ATTENDEE, hashed_password=hashed),
    ]
    db.add_all(users)
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


def test_login_success(client):
    res = client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "password123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    res = client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "wrongpassword"})
    assert res.status_code == 401


def test_role_access(client):
    # Login as admin
    res_admin = client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "password123"})
    admin_token = res_admin.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Admin access admin-only endpoint
    res = client.get("/api/v1/auth/admin-only", headers=admin_headers)
    assert res.status_code == 200
    assert "Welcome Admin" in res.json()["message"]

    # Login as attendee
    res_att = client.post("/api/v1/auth/login", json={"email": "attendee@test.com", "password": "password123"})
    att_token = res_att.json()["access_token"]
    att_headers = {"Authorization": f"Bearer {att_token}"}

    # Attendee tries admin-only endpoint -> 403 Forbidden
    res_forbidden = client.get("/api/v1/auth/admin-only", headers=att_headers)
    assert res_forbidden.status_code == 403
