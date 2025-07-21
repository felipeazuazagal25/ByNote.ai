from app.workspaces.schemas import WorkspaceCreate, WorkspaceUpdate, WorkspaceOut
from app.projects.schemas import ProjectOut
from app.models import Workspace
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User
from fastapi import HTTPException
import uuid
from sqlalchemy import select
from datetime import datetime
from app.models import Project

async def create_workspace(workspace: WorkspaceCreate, db: AsyncSession, user: User):
    try:
        db_workspace = Workspace(**workspace.model_dump(), user_id=user.id)
        db.add(db_workspace)
        await db.flush()  # This will generate the workspace ID
        await db.refresh(db_workspace)
        # Create the default project
        db_project = Project(name="Inbox", 
                         description="Inbox", 
                         is_archived=False, 
                         is_shared=False, 
                         is_deleted=False,
                         ui_color="#000000",
                         ui_icon="🔍", 
                         ui_theme="light", 
                         ui_font="sans-serif", 
                         workspace_id=db_workspace.id)
        db.add(db_project)
        await db.flush()  # This will generate the workspace ID
        await db.refresh(db_project)
        
        await db.commit()

        return db_workspace
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_workspace(workspace_id: uuid.UUID, db: AsyncSession, user: User):
    try:
        query = select(Workspace).where(Workspace.id == workspace_id, Workspace.user_id == user.id, Workspace.is_deleted == False)
        response = await db.execute(query)
        db_workspace = response.scalar_one_or_none()
        if not db_workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
        # Add the topNProjects
        db_workspace.topNProjects = [p for p in db_workspace.get_topNProjects(5)]
        
        return db_workspace
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_workspaces(db: AsyncSession, user: User):
    try:
        query = select(Workspace).where(Workspace.user_id == user.id,Workspace.is_deleted == False)
        response = await db.execute(query)
        workspaces = response.scalars().all()
        return workspaces
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

async def get_workspace_by_slug(workspace_slug:str,db: AsyncSession, user: User):
    try:
        query = select(Workspace).where(Workspace.user_id == user.id, Workspace.slug == workspace_slug, Workspace.is_deleted == False)
        response = await db.execute(query)
        db_workspace = response.scalar_one_or_none()
        if not db_workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
        # Add the topNProjects
        db_workspace.topNProjects = [p for p in db_workspace.get_topNProjects(5)]
        return db_workspace
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))
    

async def update_workspace(workspace_id: uuid.UUID, workspace: WorkspaceUpdate, db: AsyncSession, user: User):
    try:
        query = select(Workspace).where(Workspace.id == workspace_id, Workspace.user_id == user.id)
        response = await db.execute(query)
        db_workspace = response.scalar_one_or_none()
        if not db_workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
        for key, value in workspace.model_dump().items():
            setattr(db_workspace, key, value)
        await db.commit()
        await db.refresh(db_workspace)
        return db_workspace
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

async def delete_workspace(workspace_id: uuid.UUID, db: AsyncSession, user: User):
    try:
        db_workspace = await get_workspace(workspace_id, db, user)
        if not db_workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
        db_workspace.is_deleted = True
        db_workspace.deleted_at = datetime.now()
        db_workspace.updated_at = datetime.now()
        db_workspace.is_archived = False
        db_workspace.is_shared = False
        await db.commit()
        return {"message": "Workspace deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    