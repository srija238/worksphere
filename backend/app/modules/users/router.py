from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.modules.users.schema import UserCreate, UserRead
from app.modules.users.service import create_user as create_user_service
from app.modules.users.service import list_users as list_users_service
from app.core.database import get_db

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserRead])
def get_users(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return list_users_service(db)


@router.post("", response_model=UserRead)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    return create_user_service(db, user)
