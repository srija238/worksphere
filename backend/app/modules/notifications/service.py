from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_manager_or_admin
from app.modules.notifications.repository import create_notification as create_notification_record
from app.modules.notifications.repository import get_notification_by_id, get_notifications_for_user
from app.modules.notifications.repository import mark_notification_read as mark_notification_read_record
from app.modules.notifications.schema import NotificationCreate
from app.modules.users.repository import get_user_by_id


def list_my_notifications(db: Session, current_user, *, is_read: bool = None):
    return get_notifications_for_user(db, current_user.id, is_read=is_read)


def create_notification(db: Session, notification: NotificationCreate, current_user):
    require_manager_or_admin(current_user)
    if not get_user_by_id(db, notification.user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return create_notification_record(
        db,
        user_id=notification.user_id,
        title=notification.title,
        message=notification.message,
    )


def mark_notification_read(db: Session, notification_id: int, current_user):
    notification = get_notification_by_id(db, notification_id)
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    return mark_notification_read_record(db, notification)
