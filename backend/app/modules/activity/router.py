from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.activity.schema import ActivityLogRead
from app.modules.activity.service import list_activity_logs as list_activity_logs_service

router = APIRouter(prefix="/activity", tags=["activity"])


@router.get("", response_model=list[ActivityLogRead])
def get_activity_logs(
    project_id: int = None,
    task_id: int = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return list_activity_logs_service(db, project_id=project_id, task_id=task_id, limit=limit, offset=offset)
