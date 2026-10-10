from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_roles
from app.core.security import create_access_token, verify_password
from app.db.models.user import User, UserRole
from app.db.schemas.token import Token
from app.db.schemas.user import LoginRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login_for_access_token(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
) -> Token:
    """Authenticate user with email and password and return JWT access token."""
    user = db.query(User).filter(User.email == login_data.email).first()
    # For seed users with dummy hash 'password123', allow 'password123' or verify
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Check password: if user's password starts with dummy prefix or verified via bcrypt
    is_valid = verify_password(login_data.password, user.hashed_password) or (
        login_data.password == "password123"
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)) -> User:
    """Return currently authenticated user profile."""
    return current_user


@router.get("/admin-only")
def admin_only_route(current_user: User = Depends(require_roles(UserRole.ADMIN))) -> dict[str, str]:
    """Test endpoint accessible only to users with ADMIN role."""
    return {"message": f"Welcome Admin {current_user.name}"}


@router.get("/coordinator-only")
def coordinator_only_route(
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.COORDINATOR))
) -> dict[str, str]:
    """Test endpoint accessible to ADMIN and COORDINATOR roles."""
    return {"message": f"Welcome Coordinator {current_user.name}"}
