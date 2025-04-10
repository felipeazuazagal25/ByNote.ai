from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
import uuid
from sqlalchemy import ForeignKey, JSON
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from app.models import Project
    from app.models import NoteTag


class Note(Base):
    __tablename__ = "notes"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(nullable=False, default="Untitled")
    text_content: Mapped[str] = mapped_column(nullable=False, default="")
    rich_content: Mapped[dict] = mapped_column(JSON,nullable=False, default={}) # Using for example TipTap

    # Flags
    is_archived: Mapped[bool] = mapped_column(nullable=False, default=False)
    is_shared: Mapped[bool] = mapped_column(nullable=False, default=False)
    is_starred: Mapped[bool] = mapped_column(nullable=False, default=False)
    is_pinned: Mapped[bool] = mapped_column(nullable=False, default=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Relationship to the Project table
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"), nullable=False)
    project: Mapped["Project"] = relationship(back_populates="notes")

    # Relationship to the NoteTag table
    notes_tags: Mapped[List["NoteTag"]] = relationship(back_populates="note")

    # Relationship to the NoteVersions table
    note_versions: Mapped[List["NoteVersions"]] = relationship(back_populates="note")

    def __repr__(self) -> str:
        return f"Note(id={self.id}, title={self.title}, content={self.content})"
    


# Revise this afterwards
class NoteVersions(Base):
    __tablename__ = "note_versions"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    version: Mapped[int] = mapped_column(nullable=False)
    
    text_diff: Mapped[dict] = mapped_column(JSON,nullable=False) # 
    rich_diff: Mapped[dict] = mapped_column(JSON,nullable=False)

    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Relationship to the Note table
    note_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("notes.id"), nullable=False)
    note: Mapped["Note"] = relationship(back_populates="note_versions")

    def __repr__(self) -> str:
        return f"NoteVersions(id={self.id}, version={self.version}, content={self.content})"
