from pydantic import BaseModel
from datetime import datetime
import uuid
from typing import Optional, List

class NoteBase(BaseModel):
    title: str
    text_content: str
    rich_content: dict
    is_archived: bool
    is_shared: bool
    is_starred: bool
    is_pinned: bool
    
class NoteMinimal(NoteBase):
    id: uuid.UUID
    slug: str
    urlString: str
    created_at: datetime
    updated_at: datetime
    # embedding_id: uuid.UUID
    class Config:
        from_attributes = True

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    pass

class NoteOut(NoteBase):
    id: uuid.UUID
    slug: str
    urlString: str
    created_at: datetime
    updated_at: datetime

    tags: Optional[List["TagMinimal"]] = []

    class Config:
        from_attributes = True


from app.tags.schemas import TagMinimal
NoteOut.model_rebuild()