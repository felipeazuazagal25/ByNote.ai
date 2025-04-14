from typing import TypeVar, Generic, List, Type, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.embeddings.base import EmbeddableEntity, EmbeddingProvider
from app.models.embeddings import Embedding
import numpy as np
import uuid

T = TypeVar('T', bound=EmbeddableEntity)

class EmbeddingService(Generic[T]):
    def __init__(self, provider: EmbeddingProvider):
        self.provider = provider

    async def create_embedding(self, db: AsyncSession, entity: T) -> Embedding:
        text = entity.get_embedding_text()
        embedding_vector = await self.provider.generate_embedding(text)
        
        embedding = Embedding(
            embedding=embedding_vector,
            entity_id=entity.id,
            entity_type=entity.get_entity_type(),
            model_name=self.provider.model_name,
            model_version=self.provider.model_version
        )
        db.add(embedding)
        await db.commit()
        await db.refresh(embedding)
        return embedding
    
    async def find_similar_entities(self, db: AsyncSession, entity: T, limit: int = 10) -> List[T]:
        query =(select(Embedding).where(Embedding.entity_type == entity.get_entity_type()).order_by(Embedding.embedding.cosine_similarity(entity.get_embedding_vector())).limit(limit))
        result = await db.execute(query)
        return result.scalars().all()
    
    
    async def calculate_similarity(self, db: AsyncSession, entity1_id: uuid.UUID, entity2_id: uuid.UUID) -> float:
        query = select(Embedding).where(Embedding.entity_id.in_([entity1_id, entity2_id]))
        result = await db.execute(query)    
        embeddings = result.scalars().all()
        if len(embeddings) != 2:
            raise ValueError("Both entities must have embeddings")
        embedding1 = embeddings[0].embedding
        embedding2 = embeddings[1].embedding
        return 1 - np.dot(embedding1, embedding2) / (np.linalg.norm(embedding1) * np.linalg.norm(embedding2))

