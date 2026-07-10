from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: int
    assignee_id: Optional[int] = None
    status: str = "todo"
    priority: str = "medium"
    due_date: Optional[date] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    project_id: Optional[int] = None
    assignee_id: Optional[int] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[date] = None


class TaskRead(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
