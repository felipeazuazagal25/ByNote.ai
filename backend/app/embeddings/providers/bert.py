from app.embeddings.base import EmbeddingProvider
from transformers import AutoTokenizer, AutoModel
import torch
from typing import List
from app.utils import words_in_text

class BertEmbeddingProvider(EmbeddingProvider):
    def __init__(self, model_name: str = "bert-base-uncased"):
        self._model_name = model_name
        self._model_version = "1.0"  # You can update this as needed
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
        self.model.eval()

    async def generate_embedding(self, text: str, max_length: int | str = "auto") -> List[float]:
        if max_length == "auto":
            max_length = min(int(2 * words_in_text(text)), self.tokenizer.model_max_length)
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=max_length)
        with torch.no_grad():
            outputs = self.model(**inputs)
        embedding = outputs.last_hidden_state[:, 0, :].numpy()
        return embedding[0].tolist()
    
    @property
    def dimensions(self) -> int:
        return 768
    
    @property
    def model_name(self) -> str:
        return self._model_name
    
    @property
    def model_version(self) -> str:
        return self._model_version
    
