from pydantic import BaseModel


class UserBase(BaseModel):
    name: str
    email: str
    role: str = "developer"


class UserCreate(UserBase):
    password: str
    is_active: bool = True


class UserRead(UserBase):
    id: int
    is_active: bool
    model_config = {"from_attributes": True}
