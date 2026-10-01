from fastapi import APIRouter,Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User,Property,Booking,Payment,RentalContract,Activity
from ..deps import require_roles
router=APIRouter(prefix="/dashboard",tags=["Dashboards"])
@router.get("/admin")
def admin(user=Depends(require_roles("ADMIN")),db:Session=Depends(get_db)):
    users=db.query(func.count(User.user_id)).scalar() or 0
    tenants=db.query(func.count(User.user_id)).filter(User.role=="TENANT").scalar() or 0
    owners=db.query(func.count(User.user_id)).filter(User.role=="OWNER").scalar() or 0
    properties=db.query(func.count(Property.property_id)).scalar() or 0
    available=db.query(func.count(Property.property_id)).filter(Property.status=="AVAILABLE").scalar() or 0
    bookings=db.query(func.count(Booking.booking_id)).scalar() or 0
    revenue=db.query(func.coalesce(func.sum(Payment.amount),0)).filter(Payment.status=="SUCCESS").scalar() or 0
    successful_payments=db.query(func.count(Payment.payment_id)).filter(Payment.status=="SUCCESS").scalar() or 0
    contracts=db.query(func.count(RentalContract.contract_id)).scalar() or 0
    acts=[{"action":a.action,"description":a.description,"created_at":a.created_at.isoformat()} for a in db.query(Activity).order_by(Activity.created_at.desc()).limit(10).all()]
    return {"users":users,"tenants":tenants,"owners":owners,"properties":properties,"available_properties":available,"bookings":bookings,"revenue":float(revenue),"successful_payments":successful_payments,"contracts":contracts,"activities":acts}
@router.get("/owner")
def owner(user=Depends(require_roles("OWNER")),db:Session=Depends(get_db)):
    properties=db.query(func.count(Property.property_id)).filter(Property.owner_id==user.user_id).scalar() or 0
    bookings=db.query(func.count(Booking.booking_id)).join(Property,Booking.property_id==Property.property_id).filter(Property.owner_id==user.user_id).scalar() or 0
    earnings=db.query(func.coalesce(func.sum(Payment.amount),0)).join(Booking,Payment.booking_id==Booking.booking_id).join(Property,Booking.property_id==Property.property_id).filter(Property.owner_id==user.user_id,Payment.status=="SUCCESS").scalar() or 0
    return {"properties":properties,"bookings":bookings,"earnings":float(earnings)}
