from fastapi import APIRouter, Depends, HTTPException
from app.workspaces.schemas import WorkspaceCreate, WorkspaceUpdate, WorkspaceOut
from app.workspaces.service import create_workspace, update_workspace, delete_workspace, get_workspaces, get_workspace, get_workspace_by_slug
from app.auth.service import current_active_user
from app.dependencies import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.models import User
import uuid

router = APIRouter(prefix="/workspaces", tags=["workspaces"], dependencies=[Depends(current_active_user)])


@router.post("/", response_model=WorkspaceOut)
async def create_workspace_route(workspace: WorkspaceCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await create_workspace(workspace, db, user)


@router.get("/", response_model=List[WorkspaceOut])
async def get_workspaces_route(db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await get_workspaces(db, user)


@router.get("/{workspace_id}", response_model=WorkspaceOut)
async def get_workspace_route(workspace_id: uuid.UUID, topN:int = 0, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await get_workspace(workspace_id, db, user)

@router.get("/slug/{workspace_slug}", response_model=WorkspaceOut)
async def get_workspace_by_slug_route(workspace_slug: str, topN:int = 0, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await get_workspace_by_slug(workspace_slug, db, user)


@router.put("/{workspace_id}", response_model=WorkspaceOut)
async def update_workspace_route(workspace_id: uuid.UUID, workspace: WorkspaceUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await update_workspace(workspace_id, workspace, db, user)


@router.delete("/{workspace_id}")
async def delete_workspace_route(workspace_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await delete_workspace(workspace_id, db, user)
