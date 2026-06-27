from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.modules.users.repository import create_user as create_user_record
from app.modules.users.repository import get_all_users
from app.modules.users.schema import UserCreate


def list_users(db: Session):
    return get_all_users(db)


def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)
    return create_user_record(
        db,
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role,
        is_active=user.is_active,
    )
