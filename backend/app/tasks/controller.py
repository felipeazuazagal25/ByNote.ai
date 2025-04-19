from fastapi import APIRouter, Depends
from app.auth.service import current_active_user
from app.dependencies import get_db
from app.tasks.schemas import TaskCreate, TaskUpdate, TaskOut, SubTaskCreate, SubTaskUpdate, SubTaskOut
from app.tasks.service import create_task, get_task, update_task, delete_task, get_tasks_from_project, create_sub_task, get_sub_tasks_from_task, get_sub_task, update_sub_task, delete_sub_task
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.auth import User
import uuid
from typing import List

router = APIRouter(prefix='/tasks', tags=['tasks'], dependencies=[Depends(current_active_user)])

#######################################################
# ----------------------- Tasks -----------------------
#######################################################

# Create a task
@router.post('/', response_model=TaskOut, status_code=201)
async def create_task_route(task: TaskCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_task = await create_task(task, db, user)
    return db_task

# Get all tasks from a project
@router.get('/project/{project_id}', response_model=List[TaskOut], status_code=200)
async def get_tasks_from_project_route(project_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_tasks = await get_tasks_from_project(project_id, db, user)
    return db_tasks

# Get a task
@router.get('/{task_id}', response_model=TaskOut, status_code=200)
async def get_task_route(task_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_task = await get_task(task_id, db, user)
    return db_task

# Update a task
@router.put('/{task_id}', response_model=TaskOut, status_code=200)
async def update_task_route(task_id: uuid.UUID, task: TaskUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_task = await update_task(task_id, task, db, user)
    return db_task

# Delete a task
@router.delete('/{task_id}', status_code=204)
async def delete_task_route(task_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    await delete_task(task_id, db, user)
    return

#######################################################
# --------------------- Sub Tasks ---------------------
#######################################################

# Create a sub task
@router.post('/{task_id}/subtasks', response_model=SubTaskOut, status_code=201)
async def create_sub_task_route(task_id: uuid.UUID, sub_task: SubTaskCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_sub_task = await create_sub_task(task_id, sub_task, db, user)
    return db_sub_task

# Get all sub tasks from a task
@router.get('/{task_id}/subtasks', response_model=List[SubTaskOut], status_code=200)
async def get_sub_tasks_from_task_route(task_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_sub_tasks = await get_sub_tasks_from_task(task_id, db, user)
    return db_sub_tasks

# Get a sub task
@router.get('/{task_id}/subtasks/{sub_task_id}', response_model=SubTaskOut, status_code=200)
async def get_sub_task_route(task_id: uuid.UUID, sub_task_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_sub_task = await get_sub_task(sub_task_id, db, user)
    return db_sub_task

# Update a sub task
@router.put('/{task_id}/subtasks/{sub_task_id}', response_model=SubTaskOut, status_code=200)
async def update_sub_task_route(task_id: uuid.UUID, sub_task_id: uuid.UUID, sub_task: SubTaskUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_sub_task = await update_sub_task(sub_task_id, sub_task, db, user)
    return db_sub_task


