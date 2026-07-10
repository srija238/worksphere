from sqlalchemy.orm import Session

from app.modules.users.model import User


def get_all_users(db: Session):
    return db.query(User).all()


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
    role: str = "developer",
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
