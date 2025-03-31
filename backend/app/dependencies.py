from app.database import SessionLocal   

async def get_db():
    async with SessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()  # Add await here
    