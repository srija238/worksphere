from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_manager_or_admin
from app.core.security import hash_password
from app.modules.users.repository import create_user as create_user_record
from app.modules.users.repository import delete_user as delete_user_record
from app.modules.users.repository import get_all_users
from app.modules.users.repository import get_user_by_id
from app.modules.users.repository import update_user as update_user_record
from app.modules.users.schema import UserCreate, UserUpdate


def list_users(db: Session, *, search: str = None, role: str = None, limit: int = 50, offset: int = 0):
    return get_all_users(db, search=search, role=role, limit=limit, offset=offset)


def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)
    return create_user_record(
        db,
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
    )


def get_user(db: Session, user_id: int):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def update_user(db: Session, user_id: int, user_update: UserUpdate, current_user):
    if current_user.id != user_id:
        require_manager_or_admin(current_user)

    user = get_user(db, user_id)
    update_data = user_update.model_dump(exclude_unset=True)
    password = update_data.pop("password", None)
    if password:
        update_data["password_hash"] = hash_password(password)

    if "role" in update_data:
        require_manager_or_admin(current_user)

    return update_user_record(db, user, update_data)


def delete_user(db: Session, user_id: int, current_user) -> dict[str, str]:
    require_manager_or_admin(current_user)
    user = get_user(db, user_id)
    delete_user_record(db, user)
    return {"message": "User deleted"}
