from datetime import date

from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.core.enums import WorkitemStatus
from app.modules.activity.model import ActivityLog
from app.modules.projects.model import Project
from app.modules.tasks.model import Task
from app.modules.users.model import User

def get_summary(db: Session, *, today: date) -> dict[str, int]:
    return {
        "total_projects": db.query(func.count(Project.id)).scalar() or 0,
        "total_users": db.query(func.count(User.id)).scalar() or 0,
        "total_workitems": db.query(func.count(Task.id)).scalar() or 0,
        "active_workitems": (
            db.query(func.count(Task.id)).filter(Task.status != WorkitemStatus.DONE).scalar() or 0
        ),
        "overdue_workitems": (
            db.query(func.count(Task.id))
            .filter(
                Task.status != WorkitemStatus.DONE,
                Task.due_date.is_not(None),
                Task.due_date < today,
            )
            .scalar()
            or 0
        ),
    }


def get_projects_overview(db: Session, *, limit: int):
    completed_count = func.sum(case((Task.status == WorkitemStatus.DONE, 1), else_=0))
    return (
        db.query(
            Project.name.label("project_name"),
            User.name.label("manager_name"),
            Project.end_date.label("due_date"),
            func.count(Task.id).label("total_workitems"),
            completed_count.label("completed_workitems"),
        )
        .join(User, Project.owner_id == User.id)
        .outerjoin(Task, Task.project_id == Project.id)
        .group_by(Project.id, Project.name, User.name, Project.end_date, Project.created_at)
        .order_by(Project.created_at.desc(), Project.id.desc())
        .limit(limit)
        .all()
    )


def get_workitem_status_counts(db: Session):
    return (
        db.query(Task.status.label("status"), func.count(Task.id).label("count"))
        .group_by(Task.status)
        .order_by(Task.status)
        .all()
    )


def get_upcoming_project_deadlines(db: Session, *, today: date, limit: int):
    return (
        db.query(
            Project.name.label("project_name"),
            User.name.label("manager_name"),
            Project.end_date.label("due_date"),
        )
        .join(User, Project.owner_id == User.id)
        .filter(Project.end_date.is_not(None), Project.end_date >= today)
        .order_by(Project.end_date.asc(), Project.id.asc())
        .limit(limit)
        .all()
    )


def get_recent_activity(db: Session, *, limit: int):
    return (
        db.query(ActivityLog)
        .join(ActivityLog.actor)
        .outerjoin(ActivityLog.task)
        .outerjoin(ActivityLog.project)
        .order_by(ActivityLog.created_at.desc(), ActivityLog.id.desc())
        .limit(limit)
        .all()
    )
