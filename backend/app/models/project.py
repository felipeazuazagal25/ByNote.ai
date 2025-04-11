from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from app.models import User
    from app.models import ProjectTag

class Project(Base):
    __tablename__ = "projects"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    is_archived: Mapped[bool] = mapped_column(nullable=False)
    is_shared: Mapped[bool] = mapped_column(nullable=False)
    ui_color: Mapped[str] = mapped_column(nullable=True)
    ui_icon: Mapped[str] = mapped_column(nullable=True)
    ui_theme: Mapped[str] = mapped_column(nullable=True)
    ui_font: Mapped[str] = mapped_column(nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Relationship to the user table
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.id'), nullable=False)
    user: Mapped["User"] = relationship(back_populates="projects")

    # Relationship to the ProjectTag table
    projects_tags: Mapped[List["ProjectTag"]] = relationship(back_populates="project")

    def __repr__(self) -> str:
        return f"Project(id={self.id}, name={self.name}, description={self.description}, is_archived={self.is_archived}, is_shared={self.is_shared}, ui_color={self.ui_color}, ui_icon={self.ui_icon}, ui_theme={self.ui_theme}, ui_font={self.ui_font})"


    

