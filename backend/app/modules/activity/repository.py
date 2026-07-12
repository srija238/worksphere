from sqlalchemy.orm import Session

from app.modules.activity.model import ActivityLog


def get_activity_logs(db: Session, *, project_id: int = None, task_id: int = None, limit: int = 50, offset: int = 0):
    query = db.query(ActivityLog)
    if project_id is not None:
        query = query.filter(ActivityLog.project_id == project_id)
    if task_id is not None:
        query = query.filter(ActivityLog.task_id == task_id)
    return query.order_by(ActivityLog.created_at.desc()).offset(offset).limit(limit).all()


def create_activity_log(
    db: Session,
    *,
    actor_id: int,
    action: str,
    project_id: int = None,
    task_id: int = None,
    details: str = None,
) -> ActivityLog:
    activity_log = ActivityLog(
        actor_id=actor_id,
        project_id=project_id,
        task_id=task_id,
        action=action,
        details=details,
    )
    db.add(activity_log)
    db.commit()
    db.refresh(activity_log)
    return activity_log
