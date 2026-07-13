from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.enums import ProjectStatus
from app.modules.projects.model import Project


def get_all_projects(
    db: Session,
    *,
    owner_id: int = None,
    status: str = None,
    search: str = None,
    sort_by: str = "id",
    sort_order: str = "asc",
    limit: int = None,
    offset: int = 0,
):
    query = db.query(Project).options(joinedload(Project.owner), selectinload(Project.tasks))
    if owner_id is not None:
        query = query.filter(Project.owner_id == owner_id)
    if status is not None:
        query = query.filter(Project.status == status)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(Project.name.ilike(search_pattern) | Project.description.ilike(search_pattern))

    sort_columns = {
        "id": Project.id,
        "name": Project.name,
        "status": Project.status,
        "start_date": Project.start_date,
        "end_date": Project.end_date,
        "created_at": Project.created_at,
        "updated_at": Project.updated_at,
    }
    sort_column = sort_columns.get(sort_by, Project.id)
    if sort_order == "desc":
        sort_column = sort_column.desc()

    query = query.order_by(sort_column).offset(offset)
    if limit is not None:
        query = query.limit(limit)
    return query.all()


def get_project_by_id(db: Session, project_id: int):
    return (
        db.query(Project)
        .options(joinedload(Project.owner), selectinload(Project.tasks))
        .filter(Project.id == project_id)
        .first()
    )


def create_project(
    db: Session,
    *,
    name: str,
    owner_id: int,
    description: str = None,
    status: str = ProjectStatus.PLANNED.value,
    start_date=None,
    end_date=None,
) -> Project:
    project_obj = Project(
        name=name,
        description=description,
        status=status,
        owner_id=owner_id,
        start_date=start_date,
        end_date=end_date,
    )
    db.add(project_obj)
    db.commit()
    db.refresh(project_obj)
    return project_obj


def update_project(db: Session, project: Project, update_data: dict) -> Project:
    for field, value in update_data.items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project) -> None:
    db.delete(project)
    db.commit()
