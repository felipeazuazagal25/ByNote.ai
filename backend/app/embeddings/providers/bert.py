from app.embeddings.base import EmbeddingProvider
from transformers import AutoTokenizer, AutoModel
import torch
from typing import List

class BertEmbeddingProvider(EmbeddingProvider):
    def __init__(self, model_name: str = "bert-base-uncased"):
        self._model_name = model_name
        self._model_version = "1.0"  # You can update this as needed
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
        self.model.eval()

    async def generate_embedding(self, text: str) -> List[float]:
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        with torch.no_grad():
            outputs = self.model(**inputs)
            embeddings = outputs.last_hidden_state[:, 0, :].numpy()
            return embeddings[0].tolist()
    
    @property
    def dimensions(self) -> int:
        return 768
    
    @property
    def model_name(self) -> str:
        return self._model_name
    
    @property
    def model_version(self) -> str:
        return self._model_version
    
