from pydantic import BaseModel,computed_field
from typing import Optional
import uuid
from datetime import datetime
from app.projects.schemas import ProjectOut
from typing import List

class WorkspaceCreate(BaseModel):
    name: str
    description: str
    is_archived: bool = False
    is_shared: bool = False
    is_deleted: bool = False
    ui_color: Optional[str] = None
    ui_icon: Optional[str] = None
    ui_theme: Optional[str] = None
    ui_font: Optional[str] = None
    

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_archived: Optional[bool] = None
    is_shared: Optional[bool] = None
    is_deleted: Optional[bool] = None
    ui_color: Optional[str] = None
    ui_icon: Optional[str] = None
    ui_theme: Optional[str] = None
    ui_font: Optional[str] = None

class WorkspaceOut(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    is_archived: bool
    is_shared: bool
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None
    topNProjects:List[ProjectOut]
    topNNotes:Optional[List[ProjectOut]] = None

    class Config:
        from_attributes = True
        extra = "allow"
