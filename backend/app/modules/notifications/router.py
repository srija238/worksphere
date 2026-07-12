from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.notifications.schema import NotificationCreate, NotificationRead
from app.modules.notifications.service import create_notification as create_notification_service
from app.modules.notifications.service import list_my_notifications as list_my_notifications_service
from app.modules.notifications.service import mark_notification_read as mark_notification_read_service

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationRead])
def get_notifications(is_read: bool = None, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return list_my_notifications_service(db, current_user, is_read=is_read)


@router.post("", response_model=NotificationRead)
def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_notification_service(db, notification, current_user)


@router.patch("/{notification_id}/read", response_model=NotificationRead)
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return mark_notification_read_service(db, notification_id, current_user)
