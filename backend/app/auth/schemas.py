from typing import Optional
from fastapi_users import schemas
from pydantic import EmailStr
from uuid import UUID
from typing import List
from app.notes.schemas import NoteOut
# For registration
class UserCreate(schemas.BaseUserCreate):
    first_name: str
    last_name: str

# For reading user data
class UserRead(schemas.BaseUser[UUID]):
    first_name: str
    last_name: str  
    notes: Optional[List[NoteOut]] = None
    class Config:
        from_attributes = True

# For updating user data
class UserUpdate(schemas.BaseUserUpdate):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    class Config:
        from_attributes = True

class Token(schemas.BaseModel):
    access_token: str
    token_type: str


