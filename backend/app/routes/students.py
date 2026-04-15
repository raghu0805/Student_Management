from fastapi import APIRouter,Depends
from app.utils.deps import get_current_user,require_role

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