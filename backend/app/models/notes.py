from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models import User

class Note(Base):
    __tablename__ = "notes"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False, default="Untitled")
    content: Mapped[str] = mapped_column(nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["User"] = relationship(back_populates="notes")

    def __repr__(self) -> str:
        return f"Note(id={self.id}, title={self.title}, content={self.content})"
    
