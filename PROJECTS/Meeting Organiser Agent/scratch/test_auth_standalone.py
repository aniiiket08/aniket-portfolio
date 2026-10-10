from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.api.deps import get_db
from app.db.base import Base
from app.db.models.user import User, UserRole
from app.main import app

# In-memory SQLite DB
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)
db = TestingSessionLocal()

db.add_all([
    User(name="Test Admin", email="admin@test.com", role=UserRole.ADMIN, hashed_password="password123"),
    User(name="Test Attendee", email="attendee@test.com", role=UserRole.ATTENDEE, hashed_password="password123"),
])
db.commit()

def override_get_db():
    try:
        yield db
    finally:
        pass

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# Test 1: Login
res1 = client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "password123"})
assert res1.status_code == 200, f"Login failed: {res1.text}"
token = res1.json()["access_token"]
print("[OK] Login successful, token received.")

# Test 2: Admin route with Admin token
res2 = client.get("/api/v1/auth/admin-only", headers={"Authorization": f"Bearer {token}"})
assert res2.status_code == 200, f"Admin route failed: {res2.text}"
print("[OK] Admin access granted.")

# Test 3: Attendee login and admin route access
res3 = client.post("/api/v1/auth/login", json={"email": "attendee@test.com", "password": "password123"})
token_att = res3.json()["access_token"]
res4 = client.get("/api/v1/auth/admin-only", headers={"Authorization": f"Bearer {token_att}"})
assert res4.status_code == 403, f"Attendee should be blocked: {res4.text}"
print("[OK] Attendee blocked from Admin route with HTTP 403.")

print("All Auth & Role Guard checks PASSED!")
