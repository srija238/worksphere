from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import Role

from app.modules.activity.repository import create_activity_log
from app.modules.comments.repository import create_comment as create_comment_record
from app.modules.comments.repository import delete_comment as delete_comment_record
from app.modules.comments.repository import get_comment_by_id, get_comments_for_task
from app.modules.comments.schema import CommentCreate
from app.modules.tasks.repository import get_task_by_id


def list_task_comments(db: Session, task_id: int):
    if not get_task_by_id(db, task_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return get_comments_for_task(db, task_id)


def create_comment(db: Session, task_id: int, comment: CommentCreate, current_user):
    task = get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    created_comment = create_comment_record(db, task_id=task_id, user_id=current_user.id, message=comment.message)
    create_activity_log(
        db,
        actor_id=current_user.id,
        project_id=task.project_id,
        task_id=task.id,
        action="comment.created",
        details=comment.message,
    )
    return created_comment


def delete_comment(db: Session, comment_id: int, current_user) -> dict[str, str]:
    comment = get_comment_by_id(db, comment_id)
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if comment.user_id != current_user.id and current_user.role not in {Role.ADMIN, Role.MANAGER}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    delete_comment_record(db, comment)
    return {"message": "Comment deleted"}
