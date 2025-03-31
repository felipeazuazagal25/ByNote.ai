from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.notes import Note
from app.dependencies import get_db
from app.notes.schemas import NoteCreate, NoteUpdate, NoteOut
from sqlalchemy.ext.asyncio import AsyncSession
from app.notes import service
from app.auth.service import current_active_user
from app.models.auth import User

router = APIRouter(prefix='/notes', tags=['notes'], dependencies=[Depends(current_active_user)])

@router.post("/", response_model=NoteOut)
async def create_note(note: NoteCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_note = await service.create_note(note, db, user)
    return db_note

@router.get("/", response_model=List[NoteOut])
async def get_notes(db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    notes = await service.get_notes(db, user)
    return notes

@router.put("/{note_id}", response_model=NoteOut)
async def update_note(note_id: int, note: NoteUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    db_note = await service.update_note(note_id, note, db, user)
    return db_note

@router.delete("/{note_id}", status_code=204)
async def delete_note(note_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    await service.delete_note(note_id, db, user)