from fastapi import FastAPI
import logging
import sys
import uvicorn

# Importing routers
from app.notes import notes_router
from app.auth import auth_router
from app.projects import projects_router
from app.tags import tags_router
from app.embeddings import embeddings_router
from app.tasks import tasks_router
from app.workspaces import workspaces_router

# Configure logging

# Apply logging configuration

logger = logging.getLogger(name="bynote")
formatter = logging.Formatter(fmt="%(asctime)s - %(name)s - %(levelname)s %(message)s",datefmt="%Y-%m-%d %H:%M:%S")
handler=logging.StreamHandler(sys.stdout)
handler.setFormatter(formatter)
logger.setLevel(level=logging.INFO)
logger.addHandler(handler)

for name in logging.root.manager.loggerDict:
    if name in ('uvicorn'):
        uvicorn_logger = logging.getLogger(name)
        uvicorn_logger.handlers.clear()
        uvicorn_logger.addHandler(handler)
        uvicorn_logger.setLevel(logging.INFO)


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
    logger.info(msg='Health check')
    return {"message": "This is the backend for ByNote."}


@app.get('/health')
async def health():
    return {"message": "ok"}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_config=None  # This tells uvicorn to use our logging config
    )
