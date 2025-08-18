from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING, List
from sqlalchemy.ext.hybrid import hybrid_property
from slugify import slugify
from sqlalchemy import UniqueConstraint

if TYPE_CHECKING:
    from app.models import User
    from app.models import Project
    from app.models import Note


class Workspace(Base):
    __tablename__ = "workspaces"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(nullable=False)
    _slug: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)

    @hybrid_property
    def slug(self) -> str:
        return self._slug
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if 'name' in kwargs:
            self._slug = slugify(kwargs['name'])
        else:
            self._slug = slugify("untitled")

    # Flags
    is_archived: Mapped[bool] = mapped_column(nullable=False, default=False)
    is_shared: Mapped[bool] = mapped_column(nullable=False, default=False)
    is_deleted: Mapped[bool] = mapped_column(nullable=False, default=False)

    # UI
    ui_color: Mapped[str] = mapped_column(nullable=True)
    ui_icon: Mapped[str] = mapped_column(nullable=True)
    ui_theme: Mapped[str] = mapped_column(nullable=True)
    ui_font: Mapped[str] = mapped_column(nullable=True)

    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime] = mapped_column(nullable=True)


    # Relationship to the user table
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.id'), nullable=False)
    user: Mapped["User"] = relationship(back_populates="workspaces")

    # Relationship to the Project table
    projects: Mapped[List["Project"]] = relationship(back_populates="workspace", lazy="selectin", cascade="all, delete-orphan")
    def get_topNProjects(self, n: int = 5) -> List["Project"]:
        return sorted(self.projects, key=lambda p: p.updated_at, reverse=True)[:n]
    
    def get_topNNotes(self, n: int = 5) -> List["Note"]:
        all_notes = []
        print(f"Workspace {self.name} has {len(self.projects)} projects")
        for project in self.projects:
            all_notes.extend(project.notes)
        print(f"Total notes found: {len(all_notes)}")
        return all_notes[:n]

    def __repr__(self) -> str:
        return f"<Workspace {self.name}>"

    def __str__(self) -> str:
        return self.name

    def __hash__(self) -> int:
        return hash(self.id)
    

    # Constraints to the table
    __table_args__ = (
        UniqueConstraint('user_id', '_slug', name='uq_workspace_slug_per_user'),
    )



