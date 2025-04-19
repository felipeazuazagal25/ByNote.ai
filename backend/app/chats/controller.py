from fastapi import APIRouter, Depends, HTTPException
from app.chats.schemas import ChatCreate, ChatUpdate, ChatOut, MessageCreate, MessageOut, MessageUpdate
from app.dependencies import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.chats.service import create_chat, get_chats, get_chat, update_chat, delete_chat, create_message, get_messages, get_message, update_message, delete_message
from app.auth.service import current_active_user
from app.models.auth import User
from typing import List
import uuid

router = APIRouter(prefix='/chats', tags=['chats'])

# ##############################################################
# -------------------- Chat Routes --------------------
# ##############################################################

@router.post('/', response_model=ChatOut)
async def create_chat_route(chat: ChatCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await create_chat(chat, db, user)

@router.get('/', response_model=List[ChatOut])
async def get_chats_route(db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await get_chats(db, user)

@router.get('/{chat_id}', response_model=ChatOut)
async def get_chat_route(chat_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await get_chat(chat_id, db, user)

@router.put('/{chat_id}', response_model=ChatOut)
async def update_chat_route(chat_id: uuid.UUID, chat: ChatUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await update_chat(chat_id, chat, db, user)

@router.delete('/{chat_id}', status_code=204)
async def delete_chat_route(chat_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await delete_chat(chat_id, db, user)


# ##############################################################
# -------------------- Message Routes --------------------
# ##############################################################

@router.post('/{chat_id}/messages', response_model=MessageOut)
async def create_message_route(chat_id: uuid.UUID, message: MessageCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await create_message(message, chat_id, db, user)

@router.get('/{chat_id}/messages', response_model=List[MessageOut])
async def get_messages_route(chat_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await get_messages(chat_id, db, user)

# Maybe delete this route
@router.get('/{chat_id}/messages/{message_id}', response_model=MessageOut)
async def get_message_route(message_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await get_message(message_id, db, user)

@router.put('/{chat_id}/messages/{message_id}', response_model=MessageOut)
async def update_message_route(message_id: uuid.UUID, message: MessageUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await update_message(message_id, message, db, user)

@router.delete('/{chat_id}/messages/{message_id}', status_code=204)
async def delete_message_route(message_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    return await delete_message(message_id, db, user)