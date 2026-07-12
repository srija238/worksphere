from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_manager_or_admin
from app.modules.activity.repository import create_activity_log
from app.modules.projects.repository import create_project as create_project_record
from app.modules.projects.repository import delete_project as delete_project_record
from app.modules.projects.repository import get_all_projects, get_project_by_id
from app.modules.projects.repository import update_project as update_project_record
from app.modules.projects.schema import ProjectCreate, ProjectUpdate
from app.modules.users.repository import get_user_by_id


def list_projects(
    db: Session,
    *,
    owner_id: int = None,
    status: str = None,
    search: str = None,
    sort_by: str = "id",
    sort_order: str = "asc",
    limit: int = 50,
    offset: int = 0,
):
    return get_all_projects(
        db,
        owner_id=owner_id,
        status=status,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        limit=limit,
        offset=offset,
    )


def get_project(db: Session, project_id: int):
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


def create_project(db: Session, project: ProjectCreate, current_user):
    require_manager_or_admin(current_user)

    owner = get_user_by_id(db, project.owner_id)
    if not owner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner user not found")

    created_project = create_project_record(
        db,
        name=project.name,
        description=project.description,
        status=project.status,
        owner_id=project.owner_id,
        start_date=project.start_date,
        end_date=project.end_date,
    )
    create_activity_log(
        db,
        actor_id=current_user.id,
        project_id=created_project.id,
        action="project.created",
        details=created_project.name,
    )
    return created_project


def update_project(db: Session, project_id: int, project_update: ProjectUpdate, current_user):
    require_manager_or_admin(current_user)

    project = get_project(db, project_id)
    update_data = project_update.model_dump(exclude_unset=True)

    owner_id = update_data.get("owner_id")
    if owner_id is not None and not get_user_by_id(db, owner_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner user not found")

    updated_project = update_project_record(db, project, update_data)
    create_activity_log(
        db,
        actor_id=current_user.id,
        project_id=updated_project.id,
        action="project.updated",
        details=", ".join(update_data.keys()),
    )
    return updated_project


def delete_project(db: Session, project_id: int, current_user) -> dict[str, str]:
    require_manager_or_admin(current_user)

    project = get_project(db, project_id)
    project_name = project.name
    delete_project_record(db, project)
    create_activity_log(db, actor_id=current_user.id, action="project.deleted", details=project_name)
    return {"message": "Project deleted"}
