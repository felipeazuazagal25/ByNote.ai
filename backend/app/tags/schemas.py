from pydantic import BaseModel, Field
import uuid
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING



# ##############################################################
# -------------------- Tag Schemas --------------------
# ##############################################################
class TagBase(BaseModel):
    tag_name: str
    tag_color: str
    visibility: bool

class TagCreate(TagBase):
    pass

class TagUpdate(TagBase):
    id: uuid.UUID


class TagMinimal(TagBase):
    id: uuid.UUID

    class Config:
        from_attributes = True

class TagOut(TagBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TagOutFull(TagBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    # Use Any to avoid circular import
    projects: Optional[List["ProjectMinimal"]] = []
    notes: Optional[List["NoteMinimal"]] = []

    class Config:
        from_attributes = True

# ##############################################################
# -------------------- Project Tag Schemas --------------------
# ##############################################################
class ProjectTagBase(BaseModel):
    project_id: uuid.UUID
    tag_id: uuid.UUID

class ProjectTagCreate(ProjectTagBase):
    pass

class ProjectTagOut(ProjectTagBase):
    id: uuid.UUID

    class Config:
        from_attributes = True

# ##############################################################
# -------------------- Note Tag Schemas --------------------
# ##############################################################
class NoteTagBase(BaseModel):
    note_id: uuid.UUID
    tag_id: uuid.UUID

class NoteTagCreate(NoteTagBase):
    pass

class NoteTagOut(NoteTagBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


# Rebuild the model to include the tags
from app.projects.schemas import ProjectMinimal
from app.notes.schemas import NoteMinimal
TagOutFull.model_rebuild()