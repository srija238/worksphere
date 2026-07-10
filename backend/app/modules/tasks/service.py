from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_manager_or_admin
from app.modules.projects.repository import get_project_by_id
from app.modules.tasks.repository import create_task as create_task_record
from app.modules.tasks.repository import delete_task as delete_task_record
from app.modules.tasks.repository import get_all_tasks, get_task_by_id
from app.modules.tasks.repository import update_task as update_task_record
from app.modules.tasks.schema import TaskCreate, TaskUpdate
from app.modules.users.repository import get_user_by_id


def list_tasks(
    db: Session,
    *,
    project_id: int = None,
    assignee_id: int = None,
    status: str = None,
    priority: str = None,
):
    return get_all_tasks(
        db,
        project_id=project_id,
        assignee_id=assignee_id,
        status=status,
        priority=priority,
    )


def list_my_tasks(db: Session, current_user):
    return get_all_tasks(db, assignee_id=current_user.id)


def get_task(db: Session, task_id: int):
    task = get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


def can_update_task(task, current_user) -> bool:
    return current_user.role in {"admin", "manager"} or task.assignee_id == current_user.id


def create_task(db: Session, task: TaskCreate, current_user):
    require_manager_or_admin(current_user)

    project = get_project_by_id(db, task.project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if task.assignee_id is not None:
        assignee = get_user_by_id(db, task.assignee_id)
        if not assignee:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignee user not found")

    return create_task_record(
        db,
        title=task.title,
        description=task.description,
        project_id=task.project_id,
        assignee_id=task.assignee_id,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
    )


def update_task(db: Session, task_id: int, task_update: TaskUpdate, current_user):
    task = get_task(db, task_id)
    if not can_update_task(task, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    update_data = task_update.model_dump(exclude_unset=True)

    project_id = update_data.get("project_id")
    if project_id is not None and not get_project_by_id(db, project_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    assignee_id = update_data.get("assignee_id")
    if assignee_id is not None and not get_user_by_id(db, assignee_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignee user not found")

    return update_task_record(db, task, update_data)


def delete_task(db: Session, task_id: int, current_user) -> dict[str, str]:
    require_manager_or_admin(current_user)

    task = get_task(db, task_id)
    delete_task_record(db, task)
    return {"message": "Task deleted"}
