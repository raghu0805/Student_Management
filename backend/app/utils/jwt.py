from jose import jwt, JWTError
from datetime import datetime, timedelta

SECURITY_KEY = "fastapi"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECURITY_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECURITY_KEY, algorithms=ALGORITHM)
        return payload
    except JWTError:
        return None