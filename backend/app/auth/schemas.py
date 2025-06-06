from typing import Optional
from fastapi_users.schemas import BaseUser, BaseUserUpdate, BaseUserCreate, BaseModel
from pydantic import EmailStr
from uuid import UUID
from typing import List
from app.notes.schemas import NoteOut
from app.projects.schemas import ProjectOut

# For registration
class UserCreate(BaseUserCreate):
    first_name: str
    last_name: str

# For reading user data
class UserRead(BaseUser[UUID]):
    first_name: str
    last_name: str 
    is_verified: bool
    is_active: bool
    is_superuser: bool
    email: EmailStr
    default_workspace_id: UUID
    default_project_id: UUID
    # projects: Optional[List[ProjectOut]] = None
    # notes: Optional[List[NoteOut]] = None
    class Config:
        from_attributes = True

# For updating user data
class UserUpdate(BaseUserUpdate):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


