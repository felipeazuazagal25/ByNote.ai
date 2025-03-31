from fastapi import APIRouter, Depends
from app.auth.service import fastapi_users, auth_backend, current_active_user
from app.models.auth import User
from app.auth.schemas import UserRead, UserCreate, UserUpdate

import logging

# Set up logger for this module
logger = logging.getLogger("bynote")

router = APIRouter(prefix='/auth', tags=['auth'])

router.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/jwt") # Login and Logout
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate) # Register
)
router.include_router(fastapi_users.get_reset_password_router()) # Forgot Password  & Reset Password
router.include_router(fastapi_users.get_verify_router(UserRead)) # Request Verify Token & verify


# REMOVE FOR PRODUCTION
@router.get("/me", response_model=UserRead)
async def get_me(user: User = Depends(current_active_user)):
    return user