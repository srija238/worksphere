from datetime import datetime

from pydantic import BaseModel


class CommentCreate(BaseModel):
    message: str


class CommentRead(CommentCreate):
    id: int
    task_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
