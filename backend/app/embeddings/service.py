from typing import TypeVar, Generic, List, Type, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.embeddings.base import EmbeddableEntity, EmbeddingProvider
from app.models.embeddings import Embedding
import numpy as np
import uuid
from app.models import User
from datetime import datetime

T = TypeVar('T', bound=EmbeddableEntity)

class EmbeddingService(Generic[T]):
    def __init__(self, provider: EmbeddingProvider):
        self.provider = provider

    async def create_embedding(self, db: AsyncSession, entity: T, user: User) -> Embedding:
        text = entity.get_embedding_text()
        embedding_vector = await self.provider.generate_embedding(text)
        user_id = user.id
        embedding = Embedding(
            user_id=user_id,
            embedding=embedding_vector,
            entity_id=entity.id,
            entity_type=entity.get_entity_type(),
            model_name=self.provider.model_name,
        )
        db.add(embedding)
        await db.commit()
        await db.refresh(embedding)

        # Update the entity with the embedding id
        entity.embedding_id = embedding.id
        await db.commit()
        await db.refresh(entity)

        return embedding
    

    async def update_embedding(self, db: AsyncSession, entity: T, user: User) -> Embedding:
        text = entity.get_embedding_text()
        embedding_vector = await self.provider.generate_embedding(text)
        query = select(Embedding).where(Embedding.id == entity.embedding_id)
        response = await db.execute(query)
        embedding = response.scalar_one()
        embedding.embedding = embedding_vector
        embedding.updated_at = datetime.now()
        
        db.add(embedding)
        await db.commit()
        await db.refresh(embedding)
        return embedding
    
    async def delete_embedding(self, db: AsyncSession, entity: T, user: User) -> None:
        query = select(Embedding).where(Embedding.id == entity.embedding_id)
        response = await db.execute(query)
        embedding = response.scalar_one()
        await db.delete(embedding)
        await db.commit()


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



async def get_embeddings(db: AsyncSession) -> List[Embedding]:
    query = select(Embedding)
    result = await db.execute(query)
    embeddings = result.scalars().all()
    # Convert SQLAlchemy objects to dictionaries
    return embeddings