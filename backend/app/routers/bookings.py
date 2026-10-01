from decimal import Decimal
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Booking,Property,User,Activity
from ..schemas import BookingCreate,BookingStatus
from ..deps import require_roles
router=APIRouter(prefix="/bookings",tags=["Bookings"])
def out(b,db):
 p=db.get(Property,b.property_id);t=db.get(User,b.tenant_id)
 return {"booking_id":b.booking_id,"property_id":b.property_id,"tenant_id":b.tenant_id,"property_title":p.title if p else "Unknown","tenant_name":t.full_name if t else "Unknown","start_date":b.start_date,"end_date":b.end_date,"monthly_rent":b.monthly_rent,"booking_amount":b.booking_amount,"status":b.status}
@router.post("")
def create(data:BookingCreate,user=Depends(require_roles("TENANT")),db:Session=Depends(get_db)):
 p=db.get(Property,data.property_id)
 if not p or p.status!="AVAILABLE": raise HTTPException(400,"Property is not available")
 amount=(Decimal(p.monthly_rent)*Decimal(".10")).quantize(Decimal(".01"))
 b=Booking(property_id=p.property_id,tenant_id=user.user_id,start_date=data.start_date,end_date=data.end_date,monthly_rent=p.monthly_rent,booking_amount=amount,status="PENDING")
 db.add(b);db.flush();db.add(Activity(user_id=user.user_id,action="BOOKING_CREATED",description=p.title));db.commit();db.refresh(b);return out(b,db)
@router.get("/mine")
def mine(user=Depends(require_roles("TENANT")),db:Session=Depends(get_db)): return [out(b,db) for b in db.query(Booking).filter(Booking.tenant_id==user.user_id).order_by(Booking.created_at.desc()).all()]
@router.get("/owner")
def owner(user=Depends(require_roles("OWNER")),db:Session=Depends(get_db)):
    items=db.query(Booking).join(Property,Booking.property_id==Property.property_id).filter(Property.owner_id==user.user_id).order_by(Booking.created_at.desc()).all()
    return [out(b,db) for b in items]
@router.patch("/{booking_id}/status")
def status(booking_id:int,data:BookingStatus,user=Depends(require_roles("OWNER","ADMIN")),db:Session=Depends(get_db)):
 b=db.get(Booking,booking_id)
 if not b: raise HTTPException(404,"Booking not found")
 p=db.get(Property,b.property_id)
 if user.role=="OWNER" and p.owner_id!=user.user_id: raise HTTPException(403,"Not your property")
 s=data.status.upper()
 if s not in {"PENDING","CONFIRMED","CANCELLED","COMPLETED"}: raise HTTPException(400,"Invalid status")
 b.status=s
 if s=="CONFIRMED": p.status="BOOKED"
 if s in {"CANCELLED","COMPLETED"}: p.status="AVAILABLE"
 db.add(Activity(user_id=user.user_id,action="BOOKING_STATUS",description=f"Booking {booking_id}: {s}"));db.commit();db.refresh(b);return out(b,db)
