from fastapi import FastAPI
import logging
import sys

# Importing routers
from app.notes import notes_router
from app.auth import auth_router
from app.projects import projects_router
from app.tags import tags_router
from app.embeddings import embeddings_router
from app.tasks import tasks_router
from app.workspaces import workspaces_router

# Console logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.StreamHandler(sys.stderr)
    ],
    force=True
)
logger = logging.getLogger("bynote")
logger.setLevel(logging.INFO)


app = FastAPI()
# Auth Routes
app.include_router(auth_router)
# App Routes
app.include_router(notes_router)
app.include_router(projects_router)
app.include_router(tags_router)
app.include_router(embeddings_router)
app.include_router(tasks_router)
app.include_router(workspaces_router)


@app.get("/")
async def root():
    return {"message": "This is the backend for ByNote."}

@app.get('/health')
async def health():
    return {"message": "ok"}
