from app.dependencies import get_db
from app.auth.service import current_active_user
from app.models import Project
from app.projects.schemas import ProjectCreate, ProjectUpdate, ProjectOut
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException
from app.models import User
from sqlalchemy import select, update
import uuid
from app.workspaces.service import get_workspace_by_slug
from app.models.workspace import Workspace
from datetime import datetime

from app.models import Note


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
    query = (select(Project)
             .join(Workspace, Project.workspace_id == Workspace.id)
             .where(Project.id == project_id, Workspace.user_id == user.id))
    response = await db.execute(query)
    db_project = response.scalar_one_or_none()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, value in project.model_dump().items():
        setattr(db_project, field, value)

    db_project.updated_at = datetime.now()
    db_project.update_slug(project.name)

    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project

async def delete_project(project_id: uuid.UUID, move_notes:bool, destination_project_id:str, db: AsyncSession, user: User):
    query = (select(Project)
             .join(Workspace, Project.workspace_id == Workspace.id)
             .where(Project.id == project_id, Workspace.user_id == user.id))
    response = await db.execute(query)
    db_project = response.scalar_one_or_none()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if db_project.slug == "inbox":
        raise HTTPException(status_code=400, detail="Inbox project cannot be deleted")
    
    # Move the notes to another project
    if move_notes:
        # Validate destination project exists
        dest_query = (select(Project)
                      .join(Workspace, Project.workspace_id == Workspace.id)
                      .where(Project.id == destination_project_id, Workspace.user_id == user.id))
        dest_response = await db.execute(dest_query)
        dest_project = dest_response.scalar_one_or_none()
        if dest_project is None:
            raise HTTPException(status_code=404, detail="Destination project not found")

        # Get and update all notes
        await db.execute(update(Note)
                         .where(Note.project_id == project_id)
                         .values(project_id=destination_project_id))
        await db.commit()
    
    # Refresh project to avoid cascade note deletion
    await db.refresh(db_project, attribute_names=["notes"])
    # Delete the project
    await db.delete(db_project)
    await db.commit()
    return {"message": "Project deleted successfully"}

# async def create_default_project(db: AsyncSession, user: User) -> Project:
#     default_project = Project(name="Inbox", description="Inbox", is_archived=False, is_shared=False, ui_color="#000000", ui_icon="🔍", ui_theme="light", ui_font="sans-serif", user_id=user.id)
#     db.add(default_project)
#     await db.commit()
#     await db.refresh(default_project)
#     return default_project