from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from fastapi_users.db import SQLAlchemyBaseUserTable
from typing import List, Optional
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey

if TYPE_CHECKING:
    from app.models import Project
    from app.models import Tag
    from app.models import Session
    from app.models import Embedding

class User(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    first_name: Mapped[str] = mapped_column(nullable=False)
    last_name: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Fields for email and password are inherited from SQLAlchemyBaseUserTable
    #email: Mapped[
    # str] = mapped_column(nullable=False)
    #hashed_password: Mapped[str] = mapped_column(nullable=False)
    
    # Relationship to Embeddings table
    embeddings: Mapped[List['Embedding']] = relationship(back_populates='user', cascade="all, delete-orphan")

    # Relationship to the Project table
    projects: Mapped[List["Project"]] = relationship(back_populates="user", cascade="all, delete-orphan", foreign_keys="Project.user_id")
    tags: Mapped[List["Tag"]] = relationship(back_populates="user", cascade="all, delete-orphan") 
    sessions: Mapped[List["Session"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    # Default project
    default_project_id: Mapped[uuid.UUID] = mapped_column(default="12345678-1234-5678-1234-567812345678")

    def __repr__(self) -> str:
        return f"User(id={self.id}, first_name={self.first_name}, last_name={self.last_name})"