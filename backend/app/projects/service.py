from app.dependencies import get_db
from app.auth.service import current_active_user
from app.models import Project
from app.projects.schemas import ProjectCreate, ProjectUpdate, ProjectOut
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException
from app.models import User
from sqlalchemy import select
import uuid
from app.workspaces.service import get_workspace_by_slug

async def create_project(project: ProjectCreate, workspace_slug: str, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    # Get the workspaceId
    if workspace_slug is None:
        worskpace_id = user.default_workspace_id
    else:
        db_workspace = await get_workspace_by_slug(workspace_slug, db, user)
        worskpace_id = db_workspace.id

    db_project = Project(**project.model_dump(), workspace_id=worskpace_id)
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project

async def get_projects(workspace_id: str,db: AsyncSession, user: User):
    query = select(Project).where(Project.workspace_id == workspace_id)
    response = await db.execute(query)
    projects = response.scalars().all()
    return projects

async def get_project(project_id: uuid.UUID ,db: AsyncSession, user: User):
    query=select(Project).where(Project.id == project_id)
    response = await db.execute(query)
    project = response.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

async def get_project_by_slug(project_slug: str,workspace_id:uuid.UUID, db: AsyncSession, user: User):
    query = select(Project).where(Project.workspace_id == workspace_id, Project.slug == project_slug)
    response = await db.execute(query)
    project = response.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=404,detail="Project not found")
    return project

async def update_project(project_id: uuid.UUID, project: ProjectUpdate, db: AsyncSession, user: User):
    response = await db.execute(select(Project).where(Project.id == project_id, Project.user_id == user.id))
    db_project = response.scalar_one_or_none()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, value in project.model_dump().items():
        setattr(db_project, field, value)
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project

async def delete_project(project_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(Project).where(Project.id == project_id, Project.user_id == user.id)
    response = await db.execute(query)
    db_project = response.scalar_one_or_none()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if db_project.slug == "inbox":
        raise HTTPException(status_code=400, detail="Inbox project cannot be deleted")
    
    await db.delete(db_project)
    await db.commit()
    return {"message": "Project deleted successfully"}

# async def create_default_project(db: AsyncSession, user: User) -> Project:
#     default_project = Project(name="Inbox", description="Inbox", is_archived=False, is_shared=False, ui_color="#000000", ui_icon="🔍", ui_theme="light", ui_font="sans-serif", user_id=user.id)
#     db.add(default_project)
#     await db.commit()
#     await db.refresh(default_project)
#     return default_project