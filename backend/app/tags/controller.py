from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.auth.service import current_active_user
from app.models.auth import User
from typing import List
from app.tags.schemas import TagCreate, TagUpdate, TagOut, TagOutFull, ProjectTagCreate, ProjectTagOut, NoteTagCreate, NoteTagOut
from app.tags.service import create_tag, get_tags, get_tag, update_tag, delete_tag, create_project_tag, get_project_tag, delete_project_tag
import uuid


router = APIRouter(prefix='/tags', tags=['tags'], dependencies=[Depends(current_active_user)])

# ##############################################################
# ------------------------- Tag Routes -------------------------aaa
# ##############################################################


# Create a tag
@router.post('/', response_model=TagOut, status_code=201)
async def create_tag_route(tag: TagCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_tag = await create_tag(tag, db, user)
    return db_tag

# Get all tags
@router.get('/', response_model=List[TagOut], status_code=200)
async def get_tags_route(db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    tags = await get_tags(db, user)
    return tags


# Get a tag by id
@router.get('/{tag_id}', response_model=TagOutFull, status_code=200)
async def get_tag_route(tag_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_tag = await get_tag(tag_id, db, user)
    return db_tag

# Update a tag
@router.put('/{tag_id}', response_model=TagOut, status_code=200)
async def update_tag_route(tag_id: uuid.UUID, tag: TagUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_tag = await update_tag(tag_id, tag, db, user)
    return db_tag

# Delete a tag
@router.delete('/{tag_id}', status_code=204)
async def delete_tag_route(tag_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    await delete_tag(tag_id, db, user)
    return {"message": "Tag deleted successfully"}


# ##############################################################
# --------------------- Project Tag Routes ---------------------
# ##############################################################

# Create a project tag
@router.post('/project_tags', response_model=ProjectTagOut, status_code=201)
async def create_project_tag_route(project_tag: ProjectTagCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_project_tag = await create_project_tag(project_tag, db, user)
    return db_project_tag

# Get a project tag by id
@router.get('/project_tags/{project_tag_id}', response_model=ProjectTagOut, status_code=200)
async def get_project_tag_route(project_tag_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_project_tag = await get_project_tag(project_tag_id, db, user)
    return db_project_tag

# Delete a project tag
@router.delete('/project_tags/{project_tag_id}', status_code=204)
async def delete_project_tag_route(project_tag_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    await delete_project_tag(project_tag_id, db, user)
    return {"message": "Project tag deleted successfully"}

