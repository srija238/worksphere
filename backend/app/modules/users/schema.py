from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.core.enums import Role


class UserBase(BaseModel):
    name: str
    email: str
    role: Role = Role.DEVELOPER


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[Role] = None


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
