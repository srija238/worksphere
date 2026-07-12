from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import Role
from app.modules.dashboard import repository

PROJECT_OVERVIEW_LIMIT = 5
UPCOMING_DEADLINES_LIMIT = 4
RECENT_ACTIVITY_LIMIT = 5


def get_dashboard(db: Session, current_user) -> dict:
    if current_user.role == Role.ADMIN:
        return _get_admin_dashboard(db, current_user)

    # Manager and developer dashboard builders can be dispatched here later.
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Dashboard is currently available to administrators only",
    )


def _get_admin_dashboard(db: Session, current_user) -> dict:
    today = date.today()
    status_rows = repository.get_workitem_status_counts(db)
    total_workitems = sum(row.count for row in status_rows)

    projects_overview = []
    for row in repository.get_projects_overview(db, limit=PROJECT_OVERVIEW_LIMIT):
        progress = round((row.completed_workitems or 0) / row.total_workitems * 100) if row.total_workitems else 0
        projects_overview.append(
            {
                "project_name": row.project_name,
                "manager_name": row.manager_name,
                "progress": progress,
                "due_date": row.due_date,
            }
        )

    upcoming_deadlines = [
        {
            "project_name": row.project_name,
            "manager_name": row.manager_name,
            "due_date": row.due_date,
            "days_left": (row.due_date - today).days,
        }
        for row in repository.get_upcoming_project_deadlines(
            db, today=today, limit=UPCOMING_DEADLINES_LIMIT
        )
    ]

    recent_activity = []
    for activity in repository.get_recent_activity(db, limit=RECENT_ACTIVITY_LIMIT):
        entity_name = (
            activity.task.title if activity.task else activity.project.name if activity.project else activity.details
        )
        recent_activity.append(
            {
                "actor_name": activity.actor.name,
                "action": activity.action,
                "entity_name": entity_name or activity.action,
                "created_at": activity.created_at,
            }
        )

    return {
        "role": current_user.role.upper(),
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "initial": current_user.name[:1].upper(),
        },
        "dashboard": {
            "summary": repository.get_summary(db, today=today),
            "projects_overview": projects_overview,
            "workitem_status": {
                "total": total_workitems,
                "items": [
                    {
                        "status": row.status,
                        "count": row.count,
                        "percentage": round(row.count / total_workitems * 100, 2)
                        if total_workitems
                        else 0,
                    }
                    for row in status_rows
                ],
            },
            "upcoming_project_deadlines": upcoming_deadlines,
            "recent_activity": recent_activity,
        },
    }
