from fastapi import APIRouter,Depends
from app.utils.deps import get_current_user,require_role
from app.db.database import SessionLocal
from sqlalchemy.orm import Session
from app.models.students import Student
from app.models.user import User
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
router=APIRouter()
@router.get("/me")
def get_my_profile(user=Depends(get_current_user)):
    return{
        "message":"Protected route accessed",
        "user":user
    }
# ✅ Admin-only route
@router.get("/all")
def get_all_students(user = Depends(require_role("admin"))):
    return {"message": "Only admin can see this"}
# ✅ Student route
@router.get("/me")
def get_my_data(user = Depends(require_role("student"))):
    return {"message": "Student access", "user": user}

@router.get("/get-details")
def get_details(user=Depends(require_role("admin")),db:Session=Depends(get_db)):
    students=db.query(User).all()
    return students
