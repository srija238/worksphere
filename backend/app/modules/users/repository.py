from sqlalchemy.orm import Session

from app.modules.users.model import User


def get_all_users(db: Session):
    return db.query(User).all()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(
    db: Session,
    *,
    name: str,
    email: str,
    password: str,
    role: str = "developer",
    is_active: bool = True,
) -> User:
    user_obj = User(
        name=name,
        email=email,
        password=password,
        role=role,
        is_active=is_active,
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj
