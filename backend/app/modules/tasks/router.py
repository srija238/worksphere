from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.tasks.schema import TaskCreate, TaskRead, TaskUpdate
from app.modules.tasks.service import create_task as create_task_service
from app.modules.tasks.service import delete_task as delete_task_service
from app.modules.tasks.service import get_task as get_task_service
from app.modules.tasks.service import list_my_tasks as list_my_tasks_service
from app.modules.tasks.service import list_tasks as list_tasks_service
from app.modules.tasks.service import update_task as update_task_service

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead])
def get_tasks(
    project_id: int = None,
    assignee_id: int = None,
    status: str = None,
    priority: str = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return list_tasks_service(
        db,
        project_id=project_id,
        assignee_id=assignee_id,
        status=status,
        priority=priority,
    )


@router.get("/me", response_model=list[TaskRead])
def get_my_tasks(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return list_my_tasks_service(db, current_user)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_task_service(db, task_id)


@router.post("", response_model=TaskRead)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_task_service(db, task, current_user)


@router.patch("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return update_task_service(db, task_id, task, current_user)


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return delete_task_service(db, task_id, current_user)
