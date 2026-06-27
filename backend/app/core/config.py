import os

DEFAULT_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://workshpere:change_me@localhost:5432/workshpere_DB",
)
DEFAULT_JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "replace-with-a-strong-random-secret")
DEFAULT_JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


def get_database_url() -> str:
    return os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)


def get_jwt_secret_key() -> str:
    return os.getenv("JWT_SECRET_KEY", DEFAULT_JWT_SECRET_KEY)


def get_jwt_algorithm() -> str:
    return os.getenv("JWT_ALGORITHM", DEFAULT_JWT_ALGORITHM)


def get_access_token_expire_minutes() -> int:
    return int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES)))


DATABASE_URL = get_database_url()
JWT_SECRET_KEY = get_jwt_secret_key()
JWT_ALGORITHM = get_jwt_algorithm()
ACCESS_TOKEN_EXPIRE_MINUTES = get_access_token_expire_minutes()
