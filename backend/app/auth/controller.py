from fastapi import APIRouter, Depends
from app.auth.service import fastapi_users, auth_backend, current_active_user
from app.models.auth import User
from app.auth.schemas import UserRead, UserCreate, UserUpdate
import logging
import uuid
from app.auth.service import get_user_manager

# Set up logger for this module
logger = logging.getLogger("bynote")

router = APIRouter(prefix='/auth', tags=['auth'])

router.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/jwt") # Login and Logout

register_router = fastapi_users.get_register_router(UserRead, UserCreate)
register_router.routes[0].description = """
Register a new user in the ByNote application.

This endpoint allows new users to create an account by providing:
- Email address (must be unique)
- Password (must be at least 8 characters)
- First name
- Last name

After registration:
- A verification email will be sent
- User must verify their email before they can log in
- Default 'Inbox' project will be created for the user
"""

router.include_router(register_router)

router.include_router(fastapi_users.get_reset_password_router()) # Forgot Password  & Reset Password
router.include_router(fastapi_users.get_verify_router(UserRead)) # Request Verify Token & verify



# REMOVE FOR PRODUCTION
@router.get("/me", response_model=UserRead)
async def get_me(user: User = Depends(current_active_user)):
    return user


@router.delete("/me", status_code=204)
async def delete_me(user: User = Depends(current_active_user), user_manager = Depends(get_user_manager)
):
        
    await user_manager.delete(user)
    return None