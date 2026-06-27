import hashlib
from datetime import datetime, timedelta

import jwt

from app.core.config import get_access_token_expire_minutes, get_jwt_algorithm, get_jwt_secret_key


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, hashed_password: str) -> bool:
    return hash_password(password) == hashed_password


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=get_access_token_expire_minutes()))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, get_jwt_secret_key(), algorithm=get_jwt_algorithm())


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, get_jwt_secret_key(), algorithms=[get_jwt_algorithm()])
