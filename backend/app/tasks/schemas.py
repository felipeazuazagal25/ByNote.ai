from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

#######################################################
# --------------------- Sub Tasks ---------------------
#######################################################

class SubTaskBase(BaseModel):
    name: str
    description: Optional[str] = None
    checked: bool = False
    checked_at: Optional[datetime] = None
    is_pinned: bool = False
    is_archived: bool = False
    task_id: uuid.UUID

class SubTaskCreate(SubTaskBase):
    pass

class SubTaskUpdate(SubTaskBase):
    id: uuid.UUID
    pass

class SubTaskOut(SubTaskBase):
    id: uuid.UUID
    checked_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

#######################################################
# ----------------------- Tasks -----------------------
#######################################################

class TaskBase(BaseModel):
    name: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[int] = None
    is_checked: bool = False
    is_pinned: bool = False
    is_archived: bool = False
    project_id: uuid.UUID


class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    id: uuid.UUID

class TaskOut(TaskBase):
    id: uuid.UUID


class TaskOut(TaskBase):
    id: uuid.UUID
    checked_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    tags: Optional[List["TagMinimal"]] = []
    sub_tasks: Optional[List["SubTaskOut"]] = []

    class Config:
        from_attributes = True


from app.tags.schemas import TagMinimal
TaskOut.model_rebuild()
