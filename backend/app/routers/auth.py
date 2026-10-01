import os
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from ..database import get_db
from ..models import User,Activity
from ..schemas import RegisterIn,LoginIn,AdminSecondPasswordIn
from ..auth import hash_password,verify_password,create_token,decode_token
from ..deps import current_user
load_dotenv();router=APIRouter(prefix="/auth",tags=["Authentication"])
def pub(u): return {"user_id":u.user_id,"full_name":u.full_name,"email":u.email,"role":u.role,"phone":u.phone}
def jwt_secret(): return os.getenv("JWT_SECRET","rentora-change-this-secret")
def jwt_minutes(): return int(os.getenv("JWT_EXPIRE_MINUTES","720"))
def admin_second_password(): return os.getenv("ADMIN_SECOND_PASSWORD","Rentora@Admin2026")
@router.post("/register")
def register(data:RegisterIn,db:Session=Depends(get_db)):
    role=data.role.upper()
    if role not in {"TENANT","OWNER"}: raise HTTPException(400,"Choose Tenant or Owner")
    if db.query(User).filter(User.email==data.email).first(): raise HTTPException(400,"Email already registered")
    u=User(full_name=data.full_name,email=data.email,password_hash=hash_password(data.password),role=role,phone=data.phone)
    db.add(u);db.flush();db.add(Activity(user_id=u.user_id,action="REGISTER",description=f"{role} account created"));db.commit();db.refresh(u)
    token=create_token(u.user_id,u.role,jwt_secret(),jwt_minutes())
    return {"access_token":token,"token_type":"bearer","user":pub(u)}
@router.post("/login")
def login(data:LoginIn,db:Session=Depends(get_db)):
    u=db.query(User).filter(User.email==data.email).first()
    if not u or not verify_password(data.password,u.password_hash): raise HTTPException(401,"Invalid email or password")
    if u.role=="ADMIN":
        challenge=create_token(u.user_id,u.role,jwt_secret(),5,purpose="ADMIN_CHALLENGE")
        return {"requires_second_password":True,"challenge_token":challenge,"user":pub(u)}
    db.add(Activity(user_id=u.user_id,action="LOGIN",description=f"{u.role} login"));db.commit()
    token=create_token(u.user_id,u.role,jwt_secret(),jwt_minutes())
    return {"access_token":token,"token_type":"bearer","user":pub(u)}
@router.post("/admin/verify-second")
def verify_admin_second(data:AdminSecondPasswordIn,db:Session=Depends(get_db)):
    try:
        payload=decode_token(data.challenge_token,jwt_secret())
        if payload.get("purpose")!="ADMIN_CHALLENGE" or payload.get("role")!="ADMIN": raise ValueError("Invalid challenge")
        uid=int(payload["sub"])
    except Exception as exc: raise HTTPException(401,"Admin verification expired. Start login again.") from exc
    u=db.get(User,uid)
    if not u or u.role!="ADMIN": raise HTTPException(401,"Admin account not found")
    if data.second_password!=admin_second_password(): raise HTTPException(401,"Incorrect admin second password")
    db.add(Activity(user_id=u.user_id,action="ADMIN_LOGIN",description="Admin completed two-step authentication"));db.commit()
    token=create_token(u.user_id,u.role,jwt_secret(),jwt_minutes())
    return {"access_token":token,"token_type":"bearer","user":pub(u)}
@router.get("/me")
def me(user=Depends(current_user)): return pub(user)
