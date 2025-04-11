from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
import uuid
from sqlalchemy import ForeignKey, JSON
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from app.models import User

class Session(Base):
    __tablename__ = "sessions"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    start_time: Mapped[datetime] = mapped_column(default=datetime.now)
    end_time: Mapped[datetime] = mapped_column(nullable=True)
    ip_address: Mapped[str] = mapped_column(nullable=False)
    device: Mapped[str] = mapped_column(nullable=False)
    session_metadata: Mapped[dict] = mapped_column(JSON,nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now) # maybe not needed
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    # Foreign key to the user table
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["User"] = relationship(back_populates="sessions")

    # Relationship to the UserSession table
    user_sessions: Mapped[List["UserSession"]] = relationship(back_populates="session")

    def __repr__(self) -> str:
        return f"Session(id={self.id}, start_time={self.start_time}, end_time={self.end_time}, ip_address={self.ip_address}, device={self.device}, metadata={self.metadata})"


class UserSession(Base):
    __tablename__ = "user_sessions"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    action: Mapped[str] = mapped_column(nullable=False)
    timestamp: Mapped[datetime] = mapped_column(default=datetime.now)
    user_session_metadata: Mapped[dict] = mapped_column(JSON,nullable=False)
    page_url: Mapped[str] = mapped_column(nullable=False)
    component: Mapped[str] = mapped_column(nullable=False)
    # Foreign key to the session table
    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("sessions.id"), nullable=False)
    session: Mapped["Session"] = relationship(back_populates="user_sessions")

    def __repr__(self) -> str:
        return f"UserSession(id={self.id}, action={self.action}, timestamp={self.timestamp}, metadata={self.metadata}, page_url={self.page_url}, component={self.component})"
