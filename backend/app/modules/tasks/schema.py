from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel

from app.core.enums import Priority, WorkitemStatus


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: int
    assignee_id: Optional[int] = None
    status: WorkitemStatus = WorkitemStatus.TODO
    priority: Priority = Priority.MEDIUM
    due_date: Optional[date] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    project_id: Optional[int] = None
    assignee_id: Optional[int] = None
    status: Optional[WorkitemStatus] = None
    priority: Optional[Priority] = None
    due_date: Optional[date] = None


class TaskRead(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
