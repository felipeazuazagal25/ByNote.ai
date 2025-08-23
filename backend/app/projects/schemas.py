from pydantic import BaseModel
import uuid
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING


class ProjectBase(BaseModel):
    name: str
    description: str
    is_archived: bool = False
    is_shared: bool = False
    is_deleted:bool = False
    ui_order:int = 0
    ui_color: Optional[str] = None
    ui_icon: Optional[str] = None
    ui_theme: Optional[str] = None
    ui_font: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectMinimal(ProjectBase): # doesnt have any external references
    id: uuid.UUID

    class Config:
        from_attributes = True


class ProjectUpdate(ProjectBase):
    id: uuid.UUID

class ProjectOut(ProjectBase):
    id: uuid.UUID
    slug:str
    created_at: datetime
    updated_at: datetime
    projects_tags: Optional[List["ProjectTagOut"]] = []
    tags: Optional[List["TagMinimal"]] = []

    class Config:
        from_attributes = True

class ProjectOutFull(ProjectOut):
    notes: Optional[List["NoteMinimal"]] = []
    tags: Optional[List["TagMinimal"]] = []
    tasks: Optional[List["TaskMinimal"]] = []

# Rebuild the model to include the tags
from app.tags.schemas import TagMinimal, ProjectTagOut
from app.notes.schemas import NoteMinimal
from app.tasks.schemas import TaskMinimal
ProjectOut.model_rebuild()
ProjectOutFull.model_rebuild()