from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.comments.schema import CommentCreate, CommentRead
from app.modules.comments.service import create_comment as create_comment_service
from app.modules.comments.service import delete_comment as delete_comment_service
from app.modules.comments.service import list_task_comments as list_task_comments_service

router = APIRouter(tags=["comments"])


@router.get("/tasks/{task_id}/comments", response_model=list[CommentRead])
def get_task_comments(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return list_task_comments_service(db, task_id)


@router.post("/tasks/{task_id}/comments", response_model=CommentRead)
def create_comment(
    task_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_comment_service(db, task_id, comment, current_user)


@router.delete("/comments/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return delete_comment_service(db, comment_id, current_user)
