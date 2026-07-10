from sqlalchemy.orm import Session

from app.modules.tasks.model import Task


def get_all_tasks(
    db: Session,
    *,
    project_id: int = None,
    assignee_id: int = None,
    status: str = None,
    priority: str = None,
):
    query = db.query(Task)
    if project_id is not None:
        query = query.filter(Task.project_id == project_id)
    if assignee_id is not None:
        query = query.filter(Task.assignee_id == assignee_id)
    if status is not None:
        query = query.filter(Task.status == status)
    if priority is not None:
        query = query.filter(Task.priority == priority)
    return query.all()


def get_task_by_id(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()


def create_task(
    db: Session,
    *,
    title: str,
    project_id: int,
    description: str = None,
    assignee_id: int = None,
    status: str = "todo",
    priority: str = "medium",
    due_date=None,
) -> Task:
    task_obj = Task(
        title=title,
        description=description,
        project_id=project_id,
        assignee_id=assignee_id,
        status=status,
        priority=priority,
        due_date=due_date,
    )
    db.add(task_obj)
    db.commit()
    db.refresh(task_obj)
    return task_obj


def update_task(db: Session, task: Task, update_data: dict) -> Task:
    for field, value in update_data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()
