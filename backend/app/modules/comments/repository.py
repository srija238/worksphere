from sqlalchemy.orm import Session

from app.modules.comments.model import Comment


def get_comments_for_task(db: Session, task_id: int):
    return db.query(Comment).filter(Comment.task_id == task_id).order_by(Comment.created_at).all()


def get_comment_by_id(db: Session, comment_id: int):
    return db.query(Comment).filter(Comment.id == comment_id).first()


def create_comment(db: Session, *, task_id: int, user_id: int, message: str) -> Comment:
    comment = Comment(task_id=task_id, user_id=user_id, message=message)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def delete_comment(db: Session, comment: Comment) -> None:
    db.delete(comment)
    db.commit()
