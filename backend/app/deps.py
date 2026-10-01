import os
from dotenv import load_dotenv
from fastapi import Depends,HTTPException
from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer
from .auth import decode_token
from .database import get_db
load_dotenv();security=HTTPBearer(auto_error=False)
def current_user(credentials:HTTPAuthorizationCredentials|None=Depends(security),db=Depends(get_db)):
    if not credentials: raise HTTPException(401,"Authentication required")
    try:
        payload=decode_token(credentials.credentials,os.getenv("JWT_SECRET","rentora-change-this-secret"))
        if payload.get("purpose"): raise HTTPException(401,"Incomplete authentication")
        uid=int(payload["sub"])
    except HTTPException: raise
    except Exception as exc: raise HTTPException(401,"Invalid or expired token") from exc
    from .models import User
    user=db.get(User,uid)
    if not user: raise HTTPException(401,"User not found")
    return user
def require_roles(*roles):
    def checker(user=Depends(current_user)):
        if user.role not in roles: raise HTTPException(403,"Insufficient permissions")
        return user
    return checker
