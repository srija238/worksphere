from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AttachmentCreate(BaseModel):
    file_name: str
    file_url: str
    content_type: Optional[str] = None


class AttachmentRead(AttachmentCreate):
    id: int
    task_id: int
    uploaded_by_id: int
    created_at: datetime

    model_config = {"from_attributes": True}
