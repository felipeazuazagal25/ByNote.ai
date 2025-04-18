from sqlalchemy import  String, ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from app.models.base import Base
from typing import List, TYPE_CHECKING
import uuid
from datetime import datetime
from app.models.auth import User
from sqlalchemy import JSON

class Chat(Base):
    __tablename__ = "chats"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    last_message_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Flags
    is_archived: Mapped[bool] = mapped_column(nullable=False, default=False)
    is_shared: Mapped[bool] = mapped_column(nullable=False, default=False)
    is_starred: Mapped[bool] = mapped_column(nullable=False, default=False)
    is_pinned: Mapped[bool] = mapped_column(nullable=False, default=False)
    
    # Relationship with users
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="chats")

    # Relationship to messages
    messages: Mapped[List["Message"]] = relationship(back_populates="chat") 

    def __repr__(self) -> str:
        return f"Chat(id={self.id}, name={self.name}, description={self.description})"


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    # who is sending the message
    sender: Mapped[str] = mapped_column(nullable=False)
    text: Mapped[str] = mapped_column(nullable=False)
    rich_text: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Relationship to chats
    chat_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("chats.id"))
    chat: Mapped["Chat"] = relationship(back_populates="messages")

    def __repr__(self) -> str:
        return f"Message(id={self.id}, content={self.content})"