from pydantic import BaseModel
from datetime import datetime
import uuid
from typing import List


# Messages
class MessageBase(BaseModel):
    text: str
    rich_text: dict
    sender: str
    chat_id: uuid.UUID

class MessageCreate(MessageBase):
    pass

class MessageUpdate(MessageBase):
    id: uuid.UUID

class MessageOut(MessageBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


# Chats

class ChatBase(BaseModel):
    name: str
    description: str
    created_at: datetime
    last_message_at: datetime
    is_archived: bool
    is_shared: bool
    is_starred: bool
    is_pinned: bool

class ChatCreate(ChatBase):
    pass

class ChatUpdate(ChatBase):
    id: uuid.UUID
    
class ChatOut(ChatBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_archived: bool
    is_shared: bool
    is_starred: bool
    is_pinned: bool
    messages: List[MessageOut]

