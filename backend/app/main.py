from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.notes import notes_router
from app.auth import auth_router
import logging
import sys


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


@app.get("/")
async def root():
    return {"message": "this is the backend"}

@app.get('/health')
async def health():
    return {"message": "ok"}


@app.get('/dbtest')
async def dbtest(db: Session = Depends(get_db)):
    query = text('SELECT 1')
    db.execute(query)
    return {"message": "dbtest"}

