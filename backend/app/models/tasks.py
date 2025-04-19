from sqlalchemy.orm import mapped_column, Mapped
from datetime import datetime
import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING, List
from app.models import Base
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict
import logging
from app.models import Embedding

logger = logging.getLogger(__name__)


if TYPE_CHECKING:
    from app.models import Project
    from app.models import Tag

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=True)
    completed: Mapped[bool] = mapped_column(default=False)
    due_date: Mapped[datetime] = mapped_column(nullable=True)
    priority: Mapped[int] = mapped_column(nullable=True)
    is_checked: Mapped[bool] = mapped_column(default=False)
    checked_at: Mapped[datetime] = mapped_column(nullable=True)
    
    # Flags
    is_pinned: Mapped[bool] = mapped_column(default=False)
    is_archived: Mapped[bool] = mapped_column(default=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Relationships Project
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"), nullable=False)
    project: Mapped["Project"] = relationship(back_populates="tasks")

    # Relationship to Tags
    task_tags: Mapped[List["Tag"]] = relationship(secondary="task_tags", back_populates="tasks")

    # Relationship to SubTasks
    sub_tasks: Mapped[List["SubTask"]] = relationship(back_populates="task",cascade="all, delete-orphan")

    # Relationship to TaskVersions
    task_versions: Mapped[List["TaskVersion"]] = relationship(back_populates="task",cascade="all, delete-orphan")



    @property
    def entity_type(self) -> str:
        return "task"
    
    async def embeddings(self, db: AsyncSession) -> List["Embedding"]:
        query = select(Embedding).where(Embedding.entity_id == self.id)
        response = await db.execute(query)
        return response.scalars().all()
    
    async def sub_tasks(self, db: AsyncSession) -> List["SubTask"]:
        query = select(SubTask).where(SubTask.task_id == self.id)
        try:
            response = await db.execute(query)
            return response.scalars().all()
        except Exception as e:
            logger.error(f"Error getting sub_tasks: {e}")
            return []

    def get_embedding_text(self) -> Dict[str, str]:
        # Concatenate all sub_tasks names and descriptions
        sub_tasks_names = [sub_task.name for sub_task in self.sub_tasks]
        sub_tasks_descriptions = [sub_task.description for sub_task in self.sub_tasks]
        sub_tasks_content = "\n".join(sub_tasks_names + sub_tasks_descriptions)
        return {'title': self.name, 'content': self.description , 'sub_tasks': sub_tasks_content}
    
    def get_embedding_id(self, field: str) -> uuid.UUID:
        return self.embeddings[field].id

    def get_entity_type(self) -> str:
        return "task"

    def __repr__(self) -> str:
        return f"Task(id={self.id}, name={self.name}, description={self.description}, completed={self.completed}, due_date={self.due_date}, priority={self.priority}, is_checked={self.is_checked}, is_pinned={self.is_pinned}, is_archived={self.is_archived})"


    def __repr__(self) -> str:
        return f"Task(id={self.id}, name={self.name}, description={self.description}, completed={self.completed}, due_date={self.due_date}, priority={self.priority}, is_checked={self.is_checked}, is_pinned={self.is_pinned}, is_archived={self.is_archived})"


class SubTask(Base):
    __tablename__ = "sub_tasks"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=True)
    checked: Mapped[bool] = mapped_column(default=False)
    checked_at: Mapped[datetime] = mapped_column(nullable=True)

    # Flags
    is_pinned: Mapped[bool] = mapped_column(default=False)
    is_archived: Mapped[bool] = mapped_column(default=False)
    
    # Relationship to Task
    task_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tasks.id"), nullable=False)
    task: Mapped["Task"] = relationship(back_populates="sub_tasks")


class TaskVersion(Base):
    __tablename__ = "task_versions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    version: Mapped[int] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=True)
    completed: Mapped[bool] = mapped_column(default=False)
    due_date: Mapped[datetime] = mapped_column(nullable=True)
    priority: Mapped[int] = mapped_column(nullable=True)
    is_checked: Mapped[bool] = mapped_column(default=False)
    checked_at: Mapped[datetime] = mapped_column(nullable=True)

    # Relationship to Task
    task_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tasks.id"), nullable=False)
    task: Mapped["Task"] = relationship(back_populates="task_versions")

