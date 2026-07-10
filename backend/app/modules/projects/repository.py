from sqlalchemy.orm import Session

from app.modules.projects.model import Project


def get_all_projects(db: Session, *, owner_id: int = None, status: str = None):
    query = db.query(Project)
    if owner_id is not None:
        query = query.filter(Project.owner_id == owner_id)
    if status is not None:
        query = query.filter(Project.status == status)
    return query.all()


def get_project_by_id(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()


def create_project(
    db: Session,
    *,
    name: str,
    owner_id: int,
    description: str = None,
    status: str = "planned",
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
