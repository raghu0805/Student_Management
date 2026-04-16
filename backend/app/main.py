from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routes import auth, students

app = FastAPI(title="Student Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth")
app.include_router(students.router, prefix="/api/v1/students")

Base.metadata.create_all(bind=engine)

try:
    with engine.connect():
        print("✔️ DB Connected successfully")
except Exception as e:
    print("❌ DB Connection Failed:", e)

@app.get("/")
async def read_root():
    return {"message": "Server is running"}
