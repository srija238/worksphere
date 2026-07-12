from sqlalchemy.orm import Session

from app.core.enums import Role
from app.modules.users.model import User


def get_all_users(
    db: Session,
    *,
    search: str = None,
    role: str = None,
    limit: int = 50,
    offset: int = 0,
):
    query = db.query(User)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(User.name.ilike(search_pattern) | User.email.ilike(search_pattern))
    if role:
        query = query.filter(User.role == role)
    return query.order_by(User.id).offset(offset).limit(limit).all()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def create_user(
    db: Session,
    *,
    name: str,
    email: str,
    password_hash: str,
    role: str = Role.DEVELOPER.value,
) -> User:
    user_obj = User(
        name=name,
        email=email,
        password_hash=password_hash,
        role=role,
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


def update_user(db: Session, user: User, update_data: dict) -> User:
    for field, value in update_data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()
