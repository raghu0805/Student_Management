from pydantic import BaseModel

class StudentUpdate(BaseModel):
    name:str
    year:int
    course:str
class StudentCreate(BaseModel):
    name:str
    email:str
    course:str
    year:int    