from app.chats.schemas import ChatCreate, ChatUpdate, MessageCreate, MessageUpdate
from app.models.auth import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.chats import Chat, Message
import uuid
from datetime import datetime
from sqlalchemy import select, delete
from fastapi import HTTPException


# ##############################################################
# -------------------- Chat Functions --------------------
# ##############################################################

async def create_chat(chat: ChatCreate, db: AsyncSession, user: User):
    chat = Chat(**chat.model_dump(),user_id=user.id)
    db.add(chat)
    try:
        await db.commit()
        await db.refresh(chat)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return chat

async def get_chats(db: AsyncSession, user: User):
    query = select(Chat).where(Chat.user_id == user.id)
    db_chats = await db.execute(query)
    db_chats = db_chats.scalars().all()
    if not db_chats:
        return {"message": "No chats found"}
    return db_chats

async def get_chat(chat_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(Chat).where(Chat.id == chat_id)
    db_chat = await db.execute(query)
    db_chat = db_chat.scalar_one_or_none()
    if not db_chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return db_chat

async def update_chat(chat_id: uuid.UUID, chat: ChatUpdate, db: AsyncSession, user: User):
    query = select(Chat).where(Chat.id == chat_id)
    db_chat = await db.execute(query)
    db_chat = db_chat.scalar_one_or_none()
    if not db_chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    for key, value in chat.model_dump().items():
        setattr(db_chat, key, value)
    db_chat.updated_at = datetime.now()
    try:
        await db.commit()
        await db.refresh(db_chat)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return db_chat

async def delete_chat(chat_id: uuid.UUID, db: AsyncSession, user: User):
    query = delete(Chat).where(Chat.id == chat_id)
    try:
        await db.execute(query)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"message": "Chat deleted successfully"}

# ##############################################################
# -------------------- Message Functions --------------------
# ##############################################################

async def create_message(message: MessageCreate, chat_id, db, user):
    message = Message(**message.model_dump(), chat_id=chat_id)
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message

async def get_messages(chat_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(Message).where(Message.chat_id == chat_id)
    db_messages = await db.execute(query)
    db_messages = db_messages.scalars().all()
    return db_messages

async def get_message(message_id: uuid.UUID, db: AsyncSession, user: User):
    query = select(Message).where(Message.id == message_id)
    db_message = await db.execute(query)
    db_message = db_message.scalar_one_or_none()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    return db_message

async def update_message(message_id: uuid.UUID, message: MessageUpdate, db: AsyncSession, user: User):
    query = select(Message).where(Message.id == message_id)
    db_message = await db.execute(query)
    db_message = db_message.scalar_one_or_none()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    for key, value in message.model_dump().items():
        setattr(db_message, key, value)
    db_message.updated_at = datetime.now()
    try:
        await db.commit()
        await db.refresh(db_message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return db_message

async def delete_message(message_id: uuid.UUID, db: AsyncSession, user: User):
    query = delete(Message).where(Message.id == message_id)
    try:
        await db.execute(query)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"message": "Message deleted successfully"}

