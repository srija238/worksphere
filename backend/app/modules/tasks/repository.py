from sqlalchemy.orm import Session

from app.core.enums import Priority, WorkitemStatus
from app.modules.tasks.model import Task


def get_all_tasks(
    db: Session,
    *,
    project_id: int = None,
    assignee_id: int = None,
    status: str = None,
    priority: str = None,
    search: str = None,
    sort_by: str = "id",
    sort_order: str = "asc",
    limit: int = 50,
    offset: int = 0,
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
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(Task.title.ilike(search_pattern) | Task.description.ilike(search_pattern))

    sort_columns = {
        "id": Task.id,
        "title": Task.title,
        "status": Task.status,
        "priority": Task.priority,
        "due_date": Task.due_date,
        "created_at": Task.created_at,
        "updated_at": Task.updated_at,
    }
    sort_column = sort_columns.get(sort_by, Task.id)
    if sort_order == "desc":
        sort_column = sort_column.desc()

    return query.order_by(sort_column).offset(offset).limit(limit).all()


def get_task_by_id(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()


def create_task(
    db: Session,
    *,
    title: str,
    project_id: int,
    description: str = None,
    assignee_id: int = None,
    status: str = WorkitemStatus.TODO.value,
    priority: str = Priority.MEDIUM.value,
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
