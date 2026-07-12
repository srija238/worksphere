from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import Role

from app.modules.activity.repository import create_activity_log
from app.modules.attachments.repository import create_attachment as create_attachment_record
from app.modules.attachments.repository import delete_attachment as delete_attachment_record
from app.modules.attachments.repository import get_attachment_by_id, get_attachments_for_task
from app.modules.attachments.schema import AttachmentCreate
from app.modules.tasks.repository import get_task_by_id


def list_task_attachments(db: Session, task_id: int):
    if not get_task_by_id(db, task_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return get_attachments_for_task(db, task_id)


def create_attachment(db: Session, task_id: int, attachment: AttachmentCreate, current_user):
    task = get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    created_attachment = create_attachment_record(
        db,
        task_id=task_id,
        uploaded_by_id=current_user.id,
        file_name=attachment.file_name,
        file_url=attachment.file_url,
        content_type=attachment.content_type,
    )
    create_activity_log(
        db,
        actor_id=current_user.id,
        project_id=task.project_id,
        task_id=task.id,
        action="attachment.created",
        details=attachment.file_name,
    )
    return created_attachment


def delete_attachment(db: Session, attachment_id: int, current_user) -> dict[str, str]:
    attachment = get_attachment_by_id(db, attachment_id)
    if not attachment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attachment not found")
    if attachment.uploaded_by_id != current_user.id and current_user.role not in {Role.ADMIN, Role.MANAGER}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    delete_attachment_record(db, attachment)
    return {"message": "Attachment deleted"}
