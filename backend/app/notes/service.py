from app.models.notes import Note
from app.notes.schemas import NoteCreate, NoteUpdate
from typing import List
from fastapi import HTTPException
from app.dependencies import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging
from datetime import datetime
from app.auth.service import current_active_user
from app.models.auth import User
import uuid
from app.models.project import Project
from app.models.workspace import Workspace
from app.models.auth import User
from app.embeddings.service import EmbeddingService
from app.embeddings.providers import BertEmbeddingProvider
from app.workspaces.service import get_workspace_by_slug

from app.models import Embedding



logger = logging.getLogger('bynote')

async def create_note(note: NoteCreate, workspace_slug: str, project_slug:str | None = None, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)) -> Note:
    if project_slug is None:
        project_filter = 'inbox'
    else:
        project_filter = project_slug
    db_workspace = await get_workspace_by_slug(workspace_slug, db, user)
    project_result = await db.execute(select(Project).where(Project.workspace_id == db_workspace.id, Project.slug == project_filter))
    db_project = project_result.scalar_one_or_none()
    db_note = Note(**note.model_dump(), project_id=db_project.id)    
    db.add(db_note)
    db_project.updated_at = datetime.now()

    await db.commit()
    await db.refresh(db_note)
    await db.refresh(db_project)

    # Create embedding for the note
    embedding_service = EmbeddingService(provider=BertEmbeddingProvider())
    try:
        await embedding_service.create_embedding(db, db_note, user)
    except Exception as e:
        logger.error(f"Error creating embedding for note {db_note.id}: {e}")
        raise HTTPException(status_code=500, detail="Error creating embedding for note")
    return db_note
    

async def get_notes(db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user), project_id: uuid.UUID | None = None) -> List[Note]:
    if project_id is None:
        project_id_query = user.default_project_id
    else:
        project_id_query = project_id
    result = await db.execute(select(Note).where(Note.project_id == project_id_query))
    notes = result.scalars().all()
    return notes

async def get_note(note_id: uuid.UUID, project_slug:uuid.UUID, workspace_slug:str, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)) -> Note:
    if project_slug is None or workspace_slug is None:
        HTTPException(status_code=500, detail='workspace_slug and workspace_slug must be provided')
    query = (select(Note)
             .join(Project, Project.id == Note.project_id)
             .join(Workspace, Workspace.id == Project.workspace_id)
             .join(User, User.id == Workspace.user_id)
             .filter(Note.id == note_id, 
                     Project.slug == project_slug, 
                     Workspace.slug == workspace_slug,
                     User.id == user.id))
    result = await db.execute(query)
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

async def get_note_embeddings(note_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)) -> List[Embedding]:
    query = select(Note).where(Note.id == note_id)
    result = await db.execute(query)
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    embeddings = await note.embeddings(db)
    return embeddings

async def get_note_by_slug(slug:str,project_id:uuid.UUID,db: AsyncSession, user: User):
    if project_id == "":
        raise HTTPException(status_code=404, detail="project_id must be provided")
    query = select(Note).where(Note.project_id == project_id, Note.slug == slug)
    result = await db.execute(query)
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


async def update_note(note_id: uuid.UUID, note: NoteUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)) -> Note:
    result = await db.execute(select(Note).filter(Note.id == note_id))
    db_note = result.scalar_one_or_none()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    for key, value in note.model_dump().items():
        setattr(db_note, key, value)
    db_note.updated_at = datetime.now()

    await db.commit()
    await db.refresh(db_note)

    # Update the embedding
    embedding_service = EmbeddingService(provider=BertEmbeddingProvider())
    try:
        await embedding_service.update_embedding(db, db_note, user)
    except Exception as e:
        logger.error(f"Error creating embedding for note {db_note.id}: {e}")
        raise HTTPException(status_code=500, detail="Error creating embedding for note")
    
    return db_note

async def delete_note(note_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)) -> None:
    result = await db.execute(select(Note).filter(Note.id == note_id))
    db_note = result.scalar_one_or_none()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    # # Search the embedding
    # embedding_id = db_note.embedding_id
    # embedding_query = select(Embedding).filter(Embedding.id == embedding_id)
    # embedding = await db.execute(embedding_query)
    # embedding = embedding.scalar_one_or_none()
    # if not embedding:
    #     raise HTTPException(status_code=404, detail="Embedding not found")
    
    # Delete first the note, because of the foreign key constraint, and then the embedding
    await db.delete(db_note)
    await db.commit()
    # await db.delete(embedding)
    # await db.commit()
    
    return {"message": "Note (and its embedding) deleted successfully"}
