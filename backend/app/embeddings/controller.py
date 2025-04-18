from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.embeddings.service import get_embeddings, get_embeddings_by_entity_id
from app.embeddings.schemas import EmbeddingOut
from typing import List
import uuid

router = APIRouter(prefix="/embeddings", tags=["embeddings"])


@router.get("/", response_model=List[EmbeddingOut])
async def get_embeddings_route(db: AsyncSession = Depends(get_db)):
    embeddings = await get_embeddings(db)
    return embeddings

@router.get("/{entity_id}", response_model=List[EmbeddingOut])
async def get_embeddings_by_entity_id_route(entity_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    embeddings = await get_embeddings_by_entity_id(entity_id, db)
    return embeddings