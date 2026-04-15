from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate,UserLogin
from app.utils.security import hash_password,verify_password
from app.utils.jwt import create_access_token


router=APIRouter()


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()



@router.post("/register")
def register(user:UserCreate,db:Session=Depends(get_db)):
    hashed_pwd=hash_password(user.password)

    new_user=User(
        email=user.email,
        password=hashed_pwd,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message":"User Registered successfully!"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    
    # 1. Find user
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        return {"error": "User not found"}

    # 2. Verify password
    if not verify_password(user.password, db_user.password):
        return {"error": "Invalid password"}

    # 3. Create token
    token = create_access_token({
        "sub": db_user.email,
        "role": db_user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }