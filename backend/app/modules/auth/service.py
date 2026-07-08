from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.modules.auth.repository import get_auth_status as get_status
from app.modules.users.model import User
from app.modules.users.repository import get_user_by_email


def get_auth_status() -> dict[str, str]:
    return get_status()


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    if not user.is_active:
        return None
    return user


def login_user(db: Session, email: str, password: str) -> dict:
    user = authenticate_user(db, email, password)
    if not user:
        return {}
    return {
        "access_token": create_access_token(
            data={
                "sub": user.email,
                "role": user.role,
                "user_id": str(user.id),
            }
        ),
        "token_type": "bearer",
        "user": user,
    }
