from app.models import Task, SubTask
from app.tasks.schemas import TaskCreate, TaskUpdate, SubTaskCreate, SubTaskUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.auth import User
from fastapi import HTTPException
import uuid
from sqlalchemy import select
import logging

logger = logging.getLogger(__name__)


#######################################################
# ----------------------- Tasks -----------------------
#######################################################

async def create_task(project_id: uuid.UUID | None, task: TaskCreate, db: AsyncSession, user: User):
    logger.info(f"Creating task: {task.model_dump()}")
    if project_id is None:
        project_id = user.default_project_id
    try:
        db_task = Task(**task.model_dump())
        db.add(db_task)
        await db.commit()
        await db.refresh(db_task)
        logger.info(f"Task created: {db_task}")
        return db_task
    except Exception as e:
        logger.error(f"Error creating task: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def get_task(task_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(Task).where(Task.id == task_id)
    try:
        db_task = await db.execute(query)
        db_task = db_task.scalar_one_or_none()
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")
        return db_task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def update_task(task_id: uuid.UUID, task: TaskUpdate, db: AsyncSession, user: User):
    try:
        db_task = await get_task(task_id, db, user)
        if db_task is None:
            raise HTTPException(status_code=404, detail="Task not found")
        for key, value in task.model_dump().items():
            setattr(db_task, key, value)
        await db.commit()
        await db.refresh(db_task)
        return db_task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

async def get_tasks_from_project(project_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(Task).where(Task.project_id == project_id)
    try:
        response = await db.execute(query)
        tasks = response.scalars().all()
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def delete_task(task_id: uuid.UUID, db: AsyncSession, user: User):
    try:
        db_task = await get_task(task_id, db, user)
        if db_task is None:
            raise HTTPException(status_code=404, detail="Task not found")
        await db.delete(db_task)
        await db.commit()
        return {"message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#######################################################
# -------------------- Sub Tasks --------------------
#######################################################

async def create_sub_task(task_id: uuid.UUID, sub_task: SubTaskCreate, db: AsyncSession, user: User):
    db_sub_task = SubTask(**sub_task.model_dump())
    try:
        db.add(db_sub_task)
        await db.commit()
        await db.refresh(db_sub_task)
        return db_sub_task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def get_sub_task(sub_task_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(SubTask).where(SubTask.id == sub_task_id)
    try:
        response = await db.execute(query)
        sub_task = response.scalar_one_or_none()
        return sub_task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def update_sub_task(sub_task_id: uuid.UUID, sub_task: SubTaskUpdate, db: AsyncSession, user: User):
    try:
        db_sub_task = await get_sub_task(sub_task_id, db, user)
        if db_sub_task is None:
            raise HTTPException(status_code=404, detail="Sub task not found")
        for key, value in sub_task.model_dump().items():
            setattr(db_sub_task, key, value)
        await db.commit()
        await db.refresh(db_sub_task)
        return db_sub_task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def delete_sub_task(sub_task_id: uuid.UUID, db: AsyncSession, user: User):
    try:
        db_sub_task = await get_sub_task(sub_task_id, db, user)
        if db_sub_task is None:
            raise HTTPException(status_code=404, detail="Sub task not found")
        await db.delete(db_sub_task)
        await db.commit()
        return {"message": "Sub task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_sub_tasks_from_task(task_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(SubTask).where(SubTask.task_id == task_id)
    try:
        response = await db.execute(query)
        sub_tasks = response.scalars().all()
        return sub_tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))