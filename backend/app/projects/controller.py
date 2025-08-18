from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models import Project
from app.dependencies import get_db
from app.auth.service import current_active_user
from app.projects.schemas import ProjectCreate, ProjectUpdate, ProjectOut, ProjectOutFull
from app.projects.service import create_project, get_projects, get_project, get_project_by_slug, update_project, delete_project
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User
import uuid


router = APIRouter(prefix='/projects', tags=['projects'], dependencies=[Depends(current_active_user)])

@router.post('/', response_model=ProjectOut, status_code = 201)
async def create_project_route(project: ProjectCreate, workspace_slug:str | None = None, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_project = await create_project(project,workspace_slug, db, user)
    return db_project


@router.get('/', response_model = List[ProjectOut], status_code = 200)
async def get_projects_route(workspace_id:str, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    projects = await get_projects(workspace_id, db, user)
    return projects

@router.get('/{project_id}', response_model = ProjectOutFull, status_code = 200)
async def get_project_route(project_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_project = await get_project(project_id, db, user)
    return db_project

@router.get('/slug/{project_slug}', response_model = ProjectOutFull, status_code = 200)
async def get_project_by_slug_route(workspace_id:uuid.UUID,project_slug: str, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_project = await get_project_by_slug(project_slug, workspace_id, db, user)
    return db_project

@router.put('/{project_id}', response_model = ProjectOut, status_code = 200)
async def update_project_route(project_id: uuid.UUID, project: ProjectUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_project = await update_project(project_id, project, db, user)
    return db_project

@router.delete('/{project_id}', status_code = 204)
async def delete_project_route(project_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    await delete_project(project_id, db, user)
    return {"message": "Project deleted successfully"}
