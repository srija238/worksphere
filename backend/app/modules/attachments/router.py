from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.attachments.schema import AttachmentCreate, AttachmentRead
from app.modules.attachments.service import create_attachment as create_attachment_service
from app.modules.attachments.service import delete_attachment as delete_attachment_service
from app.modules.attachments.service import list_task_attachments as list_task_attachments_service

router = APIRouter(tags=["attachments"])


@router.get("/tasks/{task_id}/attachments", response_model=list[AttachmentRead])
def get_task_attachments(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return list_task_attachments_service(db, task_id)


@router.post("/tasks/{task_id}/attachments", response_model=AttachmentRead)
def create_attachment(
    task_id: int,
    attachment: AttachmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_attachment_service(db, task_id, attachment, current_user)


@router.delete("/attachments/{attachment_id}")
def delete_attachment(attachment_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return delete_attachment_service(db, attachment_id, current_user)
