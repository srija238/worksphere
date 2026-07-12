import hashlib
import hmac
import os
from datetime import datetime, timedelta
from typing import Optional

import jwt

from app.core.config import get_access_token_expire_minutes, get_jwt_algorithm, get_jwt_secret_key

PBKDF2_ITERATIONS = 260000


def hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ITERATIONS,
    ).hex()
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt}${password_hash}"


def verify_password(password: str, hashed_password: str) -> bool:
    if hashed_password.startswith("pbkdf2_sha256$"):
        _algorithm, iterations, salt, password_hash = hashed_password.split("$", 3)
        candidate_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            int(iterations),
        ).hex()
        return hmac.compare_digest(candidate_hash, password_hash)

    legacy_sha256 = hashlib.sha256(password.encode("utf-8")).hexdigest()
    if hmac.compare_digest(legacy_sha256, hashed_password):
        return True

    return hmac.compare_digest(password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=get_access_token_expire_minutes()))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, get_jwt_secret_key(), algorithm=get_jwt_algorithm())


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, get_jwt_secret_key(), algorithms=[get_jwt_algorithm()])
