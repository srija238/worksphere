from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.enums import Role
from app.modules.users.schema import UserCreate, UserRead, UserUpdate
from app.modules.users.service import create_user as create_user_service
from app.modules.users.service import delete_user as delete_user_service
from app.modules.users.service import get_user as get_user_service
from app.modules.users.service import list_users as list_users_service
from app.modules.users.service import update_user as update_user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserRead])
def get_users(
    search: str = None,
    role: Role = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return list_users_service(db, search=search, role=role, limit=limit, offset=offset)


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_user_service(db, user_id)


@router.post("", response_model=UserRead)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    return create_user_service(db, user)


@router.patch("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return update_user_service(db, user_id, user, current_user)


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return delete_user_service(db, user_id, current_user)
