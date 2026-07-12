from sqlalchemy.orm import Session

from app.modules.attachments.model import Attachment


def get_attachments_for_task(db: Session, task_id: int):
    return db.query(Attachment).filter(Attachment.task_id == task_id).order_by(Attachment.created_at).all()


def get_attachment_by_id(db: Session, attachment_id: int):
    return db.query(Attachment).filter(Attachment.id == attachment_id).first()


def create_attachment(
    db: Session,
    *,
    task_id: int,
    uploaded_by_id: int,
    file_name: str,
    file_url: str,
    content_type: str = None,
) -> Attachment:
    attachment = Attachment(
        task_id=task_id,
        uploaded_by_id=uploaded_by_id,
        file_name=file_name,
        file_url=file_url,
        content_type=content_type,
    )
    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return attachment


def delete_attachment(db: Session, attachment: Attachment) -> None:
    db.delete(attachment)
    db.commit()
