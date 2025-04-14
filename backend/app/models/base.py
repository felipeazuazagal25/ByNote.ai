from sqlalchemy import Column, DateTime, Integer
from sqlalchemy.sql import func
from ..database import Base

class BaseModel(Base):
    """Base model class that includes common fields"""
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()) 