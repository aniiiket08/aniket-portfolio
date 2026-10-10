import enum
from sqlalchemy import Enum as PyEnum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    COORDINATOR = "coordinator"
    APPROVER = "approver"
    ATTENDEE = "attendee"


class User(Base):
    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        PyEnum(UserRole, native_enum=False, values_callable=lambda x: [e.value for e in x]),
        default=UserRole.ATTENDEE,
        nullable=False,
    )
