from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.dashboard.schema import DashboardResponse
from app.modules.dashboard.service import get_dashboard as get_dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_dashboard_service(db, current_user)
