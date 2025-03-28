from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

class Note(Base):
    __tablename__ = "notes"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False, default="Untitled")
    content: Mapped[str] = mapped_column(nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)

    def __repr__(self) -> str:
        return f"Note(id={self.id}, title={self.title}, content={self.content})"
    
