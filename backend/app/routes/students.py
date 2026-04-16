from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.deps import get_current_user, require_role
from app.db.database import SessionLocal
from app.models.students import Student
from app.models.user import User
from app.schemas.student import StudentUpdate, StudentCreate
from app.utils.security import hash_password


router = APIRouter()


# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ STUDENT: Get own profile
@router.get("/me")
def get_my_data(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == user["sub"]).first()

    student = db.query(Student).filter(Student.user_id == db_user.id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return student


# ✅ STUDENT: Update own profile
@router.put("/me")
def update_my_data(
    student_data: StudentUpdate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == user["sub"]).first()

    student = db.query(Student).filter(Student.user_id == db_user.id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.name = student_data.name
    student.course = student_data.course
    student.year = student_data.year

    db.commit()

    db.refresh(student)

    return {
        "message": "Profile updated successfully",
        "student": student
    }

# ✅ ADMIN: Create Student (IMPORTANT FIX)
@router.post("/")
def create_student(
    student_data: StudentCreate,
    user = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    # find user first, if not exists, create one with default password
    db_user = db.query(User).filter(User.email == student_data.email).first()
    if not db_user:
        new_user = User(
            email=student_data.email,
            password=hash_password("student123"), # Default password
            role="student"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        db_user = new_user


    existing = db.query(Student).filter(Student.email == student_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student already exists")

    new_student = Student(
        name=student_data.name,
        email=student_data.email,
        course=student_data.course,
        year=student_data.year,
        user_id=db_user.id  
    )


    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {"message": "Student created successfully"}


# ✅ ADMIN: Get all students
@router.get("/get-students")
def get_all_students(
    user = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return db.query(Student).all()


# ✅ ADMIN: Get student by ID
@router.get("/{id}")
def get_student(
    id: int,
    user = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return student


# ✅ ADMIN: Delete student
@router.delete("/{id}")
def delete_student(
    id: int,
    user = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()

    return {"message": "Student deleted"}

