from pydantic import BaseModel
import uuid
from typing import List
from datetime import datetime
class EmbeddingBase(BaseModel):
    entity_id: uuid.UUID
    entity_type: str
    model_name: str
    embedding: List[float]

class EmbeddingOut(EmbeddingBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
