from fastapi import FastAPI
from app.db.database import Base,engine

from app.routes import auth,students

app=FastAPI()
app.include_router(auth.router,prefix="/api/v1/auth")
app.include_router(students.router, prefix="/api/v1/students")

Base.metadata.create_all(bind=engine)
#check connectivity
try:
    with engine.connect():
        print("✔️  DB Connected successfully")
except Exception as e:
    print("❌DB Connection Failed:",e)
@app.get("/")
async def read():
    return "Server is running"