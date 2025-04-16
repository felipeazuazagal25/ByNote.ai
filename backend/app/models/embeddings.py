from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base
from datetime import datetime
import uuid
from sqlalchemy import String
from pgvector.sqlalchemy import Vector
import numpy as np
from sqlalchemy import ForeignKey
from typing import TYPE_CHECKING
from sqlalchemy.orm import relationship

if TYPE_CHECKING:
    from app.models import User

class Embedding(Base):
    __tablename__ = "embeddings"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    embedding: Mapped[np.ndarray] = mapped_column(Vector(768),nullable=False)
    model_name: Mapped[str] = mapped_column(nullable=False, default="bert-base-uncased")
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Generic Foreign Key
    entity_id: Mapped[uuid.UUID] = mapped_column(nullable=False)
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)

    # Relationship to the User table
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["User"]= relationship(back_populates='embeddings')

    def __repr__(self) -> str:
        return f"Embedding(id={self.id}, model_name={self.model_name}, entity_id={self.entity_id}, entity_type={self.entity_type})"
    