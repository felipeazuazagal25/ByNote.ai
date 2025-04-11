from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from app.models import User
    from app.models import Project
    from app.models import Note

class Tag(Base):
    __tablename__ = "tags"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    tag_name: Mapped[str] = mapped_column(nullable=False)
    tag_color: Mapped[str] = mapped_column(nullable=False)
    visibility: Mapped[bool] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Relationship to the user table
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.id'), nullable=False)
    user: Mapped["User"] = relationship(back_populates="tags") # maybe not needed

    # Relationship to the ProjectTag, NoteTag tables
    projects_tags: Mapped[List["ProjectTag"]] = relationship(back_populates="tag")
    notes_tags: Mapped[List["NoteTag"]] = relationship(back_populates="tag")

    def __repr__(self) -> str:
        return f"Tag(id={self.id}, tag_name={self.tag_name}, tag_color={self.tag_color}, visibility={self.visibility})"


# Many to many relationship between projects and tags
class ProjectTag(Base):
    __tablename__ = "project_tags"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    # Tag relationship
    tag_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('tags.id'), nullable=False)
    tag:Mapped["Tag"] = relationship(back_populates='projects_tags')
    
    # Project relationship
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('projects.id'), nullable=False)
    project: Mapped["Project"] = relationship(back_populates='projects_tags')

    def __repr__(self) -> str:
        return f"ProjectTag(id={self.id}, project_id={self.project_id}, project_name={self.project.name}, tag_id={self.tag_id}, tag_name={self.tag.tag_name})"



# Many to many relationship between notes and tags
class NoteTag(Base):
    __tablename__ = "note_tags"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    # Note relationship
    note_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('notes.id'), nullable=False)
    note: Mapped["Note"] = relationship(back_populates='notes_tags')

    # Tag relationship
    tag_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('tags.id'), nullable=False)
    tag: Mapped["Tag"] = relationship(back_populates='notes_tags')

    def __repr__(self) -> str:
        return f"NoteTag(id={self.id}, note_id={self.note_id}, note_title={self.note.title}, tag_id={self.tag_id}, tag_name={self.tag.tag_name})"
    