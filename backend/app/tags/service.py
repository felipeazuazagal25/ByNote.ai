import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.tags import Tag, ProjectTag, NoteTag, TaskTag
from app.models.auth import User
from app.tags.schemas import TagCreate, TagUpdate, ProjectTagCreate, NoteTagCreate, TaskTagCreate
from fastapi import HTTPException
import datetime


# #############################################################
# ----------------------- Tag Functions -----------------------
# #############################################################

async def create_tag(tag: TagCreate, db: AsyncSession, user: User):
    db_tag = Tag(**tag.model_dump(), user_id=user.id)
    db.add(db_tag)
    await db.commit()
    await db.refresh(db_tag)
    return db_tag
    
async def get_tags(db: AsyncSession, user: User):
    query = select(Tag).where(Tag.user_id == user.id)
    response = await db.execute(query)
    tags = response.scalars().all()
    return tags

async def get_tag(tag_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(Tag).where(Tag.id == tag_id, Tag.user_id == user.id)
    response = await db.execute(query)
    tag = response.scalar_one_or_none()
    if tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag

async def update_tag(tag_id: uuid.UUID, tag: TagUpdate, db: AsyncSession, user: User):
    try:
        db_tag = await get_tag(tag_id=tag_id)
        for field, value in tag.model_dump().items():
            setattr(db_tag, field, value)
        db_tag.updated_at = datetime.now()
        db.add(db_tag)
        await db.commit()
        await db.refresh(db_tag)
        return db_tag
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def delete_tag(tag_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(Tag).where(Tag.id == tag_id, Tag.user_id == user.id)
    response = await db.execute(query)
    db_tag = response.scalar_one_or_none()
    if db_tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    await db.delete(db_tag)
    await db.commit()


# #############################################################
# ------------------- Project Tag Functions -------------------
# #############################################################

async def create_project_tag(project_tag: ProjectTagCreate, db: AsyncSession, user: User):
    db_project_tag = ProjectTag(**project_tag.model_dump())
    db.add(db_project_tag)
    try:
        await db.commit()
        await db.refresh(db_project_tag)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return db_project_tag

async def get_project_tag(project_tag_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(ProjectTag).where(ProjectTag.id == project_tag_id)
    response = await db.execute(query)
    project_tag = response.scalar_one_or_none()
    if project_tag is None:
        raise HTTPException(status_code=404, detail="Project tag not found")
    return project_tag

async def delete_project_tag(project_tag_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(ProjectTag).where(ProjectTag.id == project_tag_id)
    response = await db.execute(query)
    db_project_tag = response.scalar_one_or_none()
    if db_project_tag is None:
        raise HTTPException(status_code=404, detail="Project tag not found")
    try:
        await db.delete(db_project_tag)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"message": "Project tag deleted successfully"}


# ############################################################  
# -------------------- Note Tag Functions --------------------
# ############################################################  

async def create_note_tag(note_tag: NoteTagCreate, db: AsyncSession, user: User):
    db_note_tag = NoteTag(**note_tag.model_dump())
    db.add(db_note_tag)
    try:
        await db.commit()
        await db.refresh(db_note_tag)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return db_note_tag

async def get_note_tag(note_tag_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(NoteTag).where(NoteTag.id == note_tag_id)
    try:
        response = await db.execute(query)
        note_tag = response.scalar_one_or_none()
        if note_tag is None:
            raise HTTPException(status_code=404, detail="Note tag not found")
        return note_tag
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def delete_note_tag(note_tag_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(NoteTag).where(NoteTag.id == note_tag_id)
    try:
        response = await db.execute(query)
        db_note_tag = response.scalar_one_or_none()
        if db_note_tag is None:
            raise HTTPException(status_code=404, detail="Note tag not found")   
        await db.delete(db_note_tag)
        await db.commit()
        return {"message": "Note tag deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ############################################################
# -------------------- Task Tag Functions --------------------
# ############################################################

async def create_task_tag(task_tag: TaskTagCreate, db: AsyncSession, user: User):
    db_task_tag = TaskTag(**task_tag.model_dump())
    db.add(db_task_tag)
    try:
        await db.commit()
        await db.refresh(db_task_tag)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return db_task_tag

async def get_task_tag(task_tag_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(TaskTag).where(TaskTag.id == task_tag_id)
    try:
        response = await db.execute(query)
        task_tag = response.scalar_one_or_none()
        if task_tag is None:
            raise HTTPException(status_code=404, detail="Task tag not found")
        return task_tag
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def delete_task_tag(task_tag_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(TaskTag).where(TaskTag.id == task_tag_id)
    try:
        response = await db.execute(query)
        db_task_tag = response.scalar_one_or_none()
        if db_task_tag is None:
            raise HTTPException(status_code=404, detail="Task tag not found")
        await db.delete(db_task_tag)
        await db.commit()
        return {"message": "Task tag deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
