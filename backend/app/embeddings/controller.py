from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.embeddings.service import get_embeddings
from app.embeddings.schemas import EmbeddingOut
from typing import List

router = APIRouter(prefix="/embeddings", tags=["embeddings"])


@router.get("/", response_model=List[EmbeddingOut])
async def get_embeddings_route(db: AsyncSession = Depends(get_db)):
    embeddings = await get_embeddings(db)
    return embeddings