from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.projects.schema import ProjectCreate, ProjectRead, ProjectUpdate
from app.modules.projects.service import create_project as create_project_service
from app.modules.projects.service import delete_project as delete_project_service
from app.modules.projects.service import get_project as get_project_service
from app.modules.projects.service import list_projects as list_projects_service
from app.modules.projects.service import update_project as update_project_service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectRead])
def get_projects(
    owner_id: int = None,
    status: str = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return list_projects_service(db, owner_id=owner_id, status=status)


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_project_service(db, project_id)


@router.post("", response_model=ProjectRead)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_project_service(db, project, current_user)


@router.patch("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return update_project_service(db, project_id, project, current_user)


@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return delete_project_service(db, project_id, current_user)
