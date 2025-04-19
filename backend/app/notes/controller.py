from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.notes import Note
from app.dependencies import get_db
from app.notes.schemas import NoteCreate, NoteUpdate, NoteOut
from sqlalchemy.ext.asyncio import AsyncSession
from app.notes.service import create_note, get_notes, update_note, delete_note, get_note_embeddings
from app.auth.service import current_active_user
from app.models.auth import User
import uuid
from fastapi import Query
from app.embeddings.schemas import EmbeddingOut


router = APIRouter(prefix='/notes', tags=['notes'], dependencies=[Depends(current_active_user)])


@router.post("/", response_model=NoteOut)
async def create_note_route(note: NoteCreate ,project_id: uuid.UUID | None = None, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    """
    Create a new note.

    If no project_id is provided, the note will be created in the user's default 'Inbox' project.

    Parameters:
    - note: Note data including title, content, and flags
    - project_id: Optional UUID of the project to create the note in
    
    Returns:
    - The created note with all its details
    """
    db_note = await create_note(note, project_id, db, user)
    return db_note


# Is this behavior correct?
@router.get("/project/{project_id}", response_model=List[NoteOut])
async def get_notes_route(project_id: uuid.UUID | None = None, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    """
    Get all notes for the current user given a project_id.

    If no project_id is provided, the notes from the user's default 'Inbox' project will be returned.

    Parameters:
    - project_id: Optional UUID of the project to get the notes from
    
    Returns:
    - A list of notes with all its details
    """
    notes = await get_notes(db, user, project_id)
    return notes


@router.get("/{note_id}/embeddings", response_model=List[EmbeddingOut])
async def get_notes_embeddings_route(note_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    """
    Get all embeddings for the current user given a note_id.

    If no note_id is provided, the embeddings from the user's default 'Inbox' project will be returned.

    Parameters:
    - note_id: UUID of the note to get the embeddings from
    
    Returns:
    - A list of embeddings with all its details for the note
    """
    embeddings = await get_note_embeddings(note_id, db, user)
    return embeddings

@router.put("/{note_id}", response_model=NoteOut)
async def update_note_route(note_id: uuid.UUID, note: NoteUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_note = await update_note(note_id, note, db, user)
    return db_note

@router.delete("/{note_id}", status_code=204)
async def delete_note_route(note_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    await delete_note(note_id, db, user)