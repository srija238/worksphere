from sqlalchemy.orm import Session

from app.modules.activity.repository import get_activity_logs


def list_activity_logs(db: Session, *, project_id: int = None, task_id: int = None, limit: int = 50, offset: int = 0):
    return get_activity_logs(db, project_id=project_id, task_id=task_id, limit=limit, offset=offset)
