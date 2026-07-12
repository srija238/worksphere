from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class DashboardUser(BaseModel):
    id: int
    name: str
    initial: str


class DashboardSummary(BaseModel):
    total_projects: int
    total_users: int
    total_workitems: int
    active_workitems: int
    overdue_workitems: int


class ProjectOverview(BaseModel):
    project_name: str
    manager_name: str
    progress: int
    due_date: Optional[date]


class WorkitemStatusItem(BaseModel):
    status: str
    count: int
    percentage: float


class WorkitemStatus(BaseModel):
    total: int
    items: list[WorkitemStatusItem]


class UpcomingProjectDeadline(BaseModel):
    project_name: str
    manager_name: str
    due_date: date
    days_left: int


class RecentActivity(BaseModel):
    actor_name: str
    action: str
    entity_name: str
    created_at: datetime


class AdminDashboard(BaseModel):
    summary: DashboardSummary
    projects_overview: list[ProjectOverview]
    workitem_status: WorkitemStatus
    upcoming_project_deadlines: list[UpcomingProjectDeadline]
    recent_activity: list[RecentActivity]


class DashboardResponse(BaseModel):
    role: str
    user: DashboardUser
    dashboard: AdminDashboard
