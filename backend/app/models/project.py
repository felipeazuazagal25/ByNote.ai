from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING, List
from slugify import slugify 
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import UniqueConstraint

if TYPE_CHECKING:
    from app.models import Workspace
    from app.models import ProjectTag
    from app.models import Note
    from app.models import Tag
    from app.models import Task

class Project(Base):
    __tablename__ = "projects"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    _slug: Mapped[str] = mapped_column(nullable=False)

    @hybrid_property
    def slug(self) -> str:
        return self._slug
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if 'name' in kwargs:
            self._slug = slugify(kwargs['name'])
        else:
            self._slug = slugify("Untitled")

    __table_args__ = (
        UniqueConstraint('workspace_id', '_slug', name='uq_workspace_project_slug'),
    )

    # Flags
    is_archived: Mapped[bool] = mapped_column(nullable=False)
    is_deleted: Mapped[bool] = mapped_column(nullable=False)
    is_shared: Mapped[bool] = mapped_column(nullable=False)

    # UI
    ui_color: Mapped[str] = mapped_column(nullable=True)
    ui_icon: Mapped[str] = mapped_column(nullable=True)
    ui_theme: Mapped[str] = mapped_column(nullable=True)
    ui_font: Mapped[str] = mapped_column(nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime] = mapped_column(nullable=True)

    # Relationship to the workspace table
    workspace_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('workspaces.id'), nullable=False)
    workspace: Mapped["Workspace"] = relationship(back_populates="projects")

    # Relationship to the ProjectTag table
    projects_tags: Mapped[List["ProjectTag"]] = relationship(back_populates="project", lazy="selectin", cascade="all, delete-orphan")
    tags: Mapped[List["Tag"]] = relationship('Tag', secondary='project_tags', back_populates="projects", lazy="selectin", viewonly=True)

    # Relationship to the Notes table
    notes: Mapped[List["Note"]] = relationship(back_populates='project',lazy="selectin",cascade="all, delete-orphan")

    # Relationship to the Tasks table
    tasks: Mapped[List["Task"]] = relationship(back_populates='project',lazy="selectin",cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"Project(id={self.id}, name={self.name}, description={self.description}, is_archived={self.is_archived}, is_shared={self.is_shared}, ui_color={self.ui_color}, ui_icon={self.ui_icon}, ui_theme={self.ui_theme}, ui_font={self.ui_font})"


    

