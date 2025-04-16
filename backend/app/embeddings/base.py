from abc import ABC, abstractmethod
from typing import List, Any, TypeVar, Generic
import uuid


T = TypeVar('T')

class EmbeddableEntity(ABC):
    @abstractmethod
    def get_embedding_text(self) -> str:
        """Get the embedding for the entity"""
        pass

    @abstractmethod
    def get_entity_type(self) -> str:
        """Get the model name for the entity"""
        pass

class EmbeddingProvider(ABC):
    @abstractmethod
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate an embedding for a given text"""
        pass

    @property
    @abstractmethod
    def dimensions(self) -> int:
        """Get the dimensions of the embedding"""
        pass
    
    @property
    @abstractmethod
    def model_name(self) -> str:
        """Get the model name for the embedding"""
        pass
    
    @property
    @abstractmethod
    def model_version(self) -> str:
        """Get the model version for the embedding"""
        pass
    
