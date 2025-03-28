from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.notes import Note
from app.dependencies import get_db
from app.schemas import notes as note_schemas

router = APIRouter(prefix='/notes', tags=['notes'])

@router.post("/", response_model=note_schemas.NoteOut)
async def create_note(note: note_schemas.NoteCreate, db: Session = Depends(get_db)):
    db_note = Note(**note.model_dump())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@router.get("/", response_model=List[note_schemas.NoteOut])
async def get_notes(db: Session = Depends(get_db)):
    notes = db.query(Note).all()
    return notes