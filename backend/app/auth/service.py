from fastapi import Depends, HTTPException, Request
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin
from fastapi_users.authentication import (AuthenticationBackend,
                                          BearerTransport,
                                          JWTStrategy)
from app.models.auth import User
from app.dependencies import get_db, get_db_session
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
import os
from typing import Optional 
from pathlib import Path
from dotenv import load_dotenv
from uuid import UUID
import logging
import random
import string
from typing import TYPE_CHECKING
from app.models import Project

    

logger = logging.getLogger(__name__)

base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / '.env'
load_dotenv(dotenv_path=env_path)

SECRET = os.getenv("SECRET")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

class UserManager(UUIDIDMixin, BaseUserManager[User, UUID]):
    reset_password_token_secret = os.getenv("SECRET")
    verification_token_secret = os.getenv("SECRET")
    verification_codes = {}  # Store verification codes


    async def validate_user(self, user: User) -> None:
        if not user.is_verified:
            raise HTTPException(
                status_code=403,
                detail="User is not verified"
            )

    def generate_verification_token(self, user: User):
        # Generate a 6 digit token
        token = ''.join(random.choices(string.digits, k=6))
        self.verification_codes[str(user.id)] = token
        return token
        
    async def verify_token(self, token: str, user: User):
        stored_code = self.verification_codes.get(str(user.id))
        return stored_code == token
    
    async def on_after_register(self, user: User, request: Optional[Request] = None):
        db = await get_db_session()  # Get the database session
        try:
            user_in_session = await db.get(User, user.id)
            await create_default_project(user_in_session, db)
            print(f"User {user.id} has registered.")
        finally:
            await db.close()

    async def on_after_forgot_password(self, user: User, token: str, request: Optional[Request] = None):
        print(f"User {user.id} has forgot their password.")
        

    # Called when a user requests a verification token
    async def on_after_request_verify(self, user: User, token: str, request: Optional[Request] = None) -> dict:
        try:
            logger.debug(f"Starting verification request for user: {user.email}")
            verification_code = self.generate_verification_token(user) # Generate new 6-digit code
            logger.debug(f"Generated verification code: {verification_code}")
            self.verification_codes[str(user.id)] = verification_code # Store the code
            logger.debug(f"Stored verification code for user {user.email}")
            return {"verification_code": verification_code}
        except Exception as e:
            logger.error(f"Error in verification request: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error processing verification request: {str(e)}"
            )    
    
    async def verify(self, token: str, user: User, request: Optional[Request] = None) -> None:
        logger.info(f"Verifying token for user {user.email}")
        stored_code = self.verification_codes.get(str(user.id))
        if not stored_code or stored_code != token:
            logger.error(f"Invalid verification code for user {user.email}")
            raise HTTPException(
                status_code=400,
                detail="Invalid verification code"
            )
        # Mark user as verified
        await self.user_db.update(user, {"is_verified": True})
        logger.info(f"User {user.email} marked as verified")
        # Clean up the stored code
        self.verification_codes.pop(str(user.id), None)
        await self.on_after_verify(user, request)

    async def on_after_verify(
        self, 
        user: User, 
        request: Optional[Request] = None
    ) -> None:
        logger.info(f"User {user.id} has been verified successfully")


bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=ACCESS_TOKEN_EXPIRE_MINUTES * 60) 

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

async def get_user_db(session: AsyncSession = Depends(get_db)):
    yield SQLAlchemyUserDatabase(session, User)

async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)

# Update this line
fastapi_users = FastAPIUsers[User, UUID](get_user_manager, [auth_backend]) 

current_active_user = fastapi_users.current_user(active=True)


async def verified_user(user: User = Depends(current_active_user)):
    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="User is not verified"
        )
    return user


async def create_default_project(user: User, db: AsyncSession) -> Project:
    db_project = Project(name="Inbox", description="Inbox", is_archived=False, is_shared=False, ui_color="#000000", ui_icon="🔍", ui_theme="light", ui_font="sans-serif", user_id=user.id)
    db.add(db_project)
    await db.flush()  # This will generate the project ID
    
    # Update user with the new project ID
    user.default_project_id = db_project.id
    db.add(user)
    await db.commit()
    await db.refresh(db_project)
    await db.refresh(user)
    
    return db_project
        
        