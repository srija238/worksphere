from datetime import datetime

from pydantic import BaseModel


class UserBase(BaseModel):
    name: str
    email: str
    role: str = "developer"


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
