from datetime import datetime
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Booking,RentalContract,Activity,Property
from ..deps import require_roles
router=APIRouter(prefix="/contracts",tags=["Contracts"])

def out(c):
    return {"contract_id":c.contract_id,"booking_id":c.booking_id,"contract_number":c.contract_number,"terms":c.terms,"tenant_signed":c.tenant_signed,"owner_signed":c.owner_signed,"contract_status":c.contract_status}

@router.get("/mine")
def mine(user=Depends(require_roles("TENANT")),db:Session=Depends(get_db)):
    items=db.query(RentalContract).join(Booking,RentalContract.booking_id==Booking.booking_id).filter(Booking.tenant_id==user.user_id).order_by(RentalContract.created_at.desc()).all()
    return [out(c) for c in items]

@router.get("/owner")
def owner_contracts(user=Depends(require_roles("OWNER")),db:Session=Depends(get_db)):
    items=(db.query(RentalContract)
        .join(Booking,RentalContract.booking_id==Booking.booking_id)
        .join(Property,Booking.property_id==Property.property_id)
        .filter(Property.owner_id==user.user_id)
        .order_by(RentalContract.created_at.desc()).all())
    result=[]
    for c in items:
        b=db.get(Booking,c.booking_id)
        result.append({**out(c),"property_id":b.property_id if b else None,"property_title":db.get(Property,b.property_id).title if b else "Unknown"})
    return result

@router.post("/{booking_id}")
def create(booking_id:int,user=Depends(require_roles("TENANT")),db:Session=Depends(get_db)):
    b=db.get(Booking,booking_id)
    if not b or b.tenant_id!=user.user_id: raise HTTPException(404,"Booking not found")
    if b.status not in {"CONFIRMED","COMPLETED"}: raise HTTPException(400,"Rental agreement can be generated after the booking is confirmed")
    c=db.query(RentalContract).filter(RentalContract.booking_id==booking_id).first()
    if c:return out(c)
    c=RentalContract(booking_id=booking_id,contract_number=f"REN-{datetime.utcnow().year}-{booking_id:05d}",terms="Residential rental agreement covering monthly rent, responsible use, maintenance, payment schedule and mutually agreed termination conditions.",tenant_signed=True,owner_signed=False,contract_status="DRAFT")
    db.add(c);db.add(Activity(user_id=user.user_id,action="CONTRACT_CREATED",description=c.contract_number));db.commit();db.refresh(c);return out(c)

@router.patch("/{contract_id}/owner-confirm")
def owner_confirm(contract_id:int,user=Depends(require_roles("OWNER")),db:Session=Depends(get_db)):
    c=db.get(RentalContract,contract_id)
    if not c: raise HTTPException(404,"Rental agreement not found")
    b=db.get(Booking,c.booking_id)
    p=db.get(Property,b.property_id) if b else None
    if not b or not p or p.owner_id!=user.user_id: raise HTTPException(403,"You do not own this rental agreement")
    if not c.tenant_signed: raise HTTPException(400,"Tenant has not signed the agreement yet")
    if c.owner_signed and c.contract_status=="ACTIVE": return out(c)
    c.owner_signed=True
    c.contract_status="ACTIVE"
    db.add(Activity(user_id=user.user_id,action="CONTRACT_CONFIRMED",description=f"{c.contract_number} confirmed by owner"))
    db.commit();db.refresh(c);return out(c)
