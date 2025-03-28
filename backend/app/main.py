from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.routes import notes as notes_router
from app.schemas import notes as note_schemas

app = FastAPI()
app.include_router(notes_router.router)

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

