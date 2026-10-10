from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr
from app.db.models.user import UserRole


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.ATTENDEE


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
