from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.notes import Note
from app.dependencies import get_db
from app.notes.schemas import NoteCreate, NoteUpdate, NoteOut
from sqlalchemy.ext.asyncio import AsyncSession
from app.notes.service import create_note, get_notes, update_note, delete_note
from app.auth.service import current_active_user
from app.models.auth import User
import uuid

router = APIRouter(prefix='/notes', tags=['notes'], dependencies=[Depends(current_active_user)])

@router.post("/", response_model=NoteOut)
async def create_note_route(note: NoteCreate, project_id: uuid.UUID | None = None, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
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

@router.get("/", response_model=List[NoteOut])
async def get_notes_route(db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    notes = await get_notes(db, user)
    return notes

@router.put("/{note_id}", response_model=NoteOut)
async def update_note_route(note_id: int, note: NoteUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_note = await update_note(note_id, note, db, user)
    return db_note

@router.delete("/{note_id}", status_code=204)
async def delete_note_route(note_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    await delete_note(note_id, db, user)