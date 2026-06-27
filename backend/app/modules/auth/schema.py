from pydantic import BaseModel

from app.modules.users.schema import UserRead


class AuthHealthResponse(BaseModel):
    status: str


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
