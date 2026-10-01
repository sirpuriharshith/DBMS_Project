from datetime import datetime
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Booking,Payment,Activity
from ..schemas import PaymentCreate
from ..deps import require_roles
router=APIRouter(prefix="/payments",tags=["Payments"])
@router.post("")
def pay(data:PaymentCreate,user=Depends(require_roles("TENANT")),db:Session=Depends(get_db)):
 b=db.get(Booking,data.booking_id)
 if not b or b.tenant_id!=user.user_id: raise HTTPException(404,"Booking not found")
 existing=db.query(Payment).filter(Payment.booking_id==b.booking_id,Payment.status=="SUCCESS").first()
 if existing:return {"payment_id":existing.payment_id,"status":existing.status,"transaction_ref":existing.transaction_ref,"amount":float(existing.amount)}
 ref=f"RENTORA-{int(datetime.utcnow().timestamp())}-{b.booking_id}"
 pay=Payment(booking_id=b.booking_id,amount=b.booking_amount,payment_method="DEMO",transaction_ref=ref,status="SUCCESS",paid_at=datetime.utcnow())
 b.status="CONFIRMED";db.add(pay);db.add(Activity(user_id=user.user_id,action="PAYMENT_SUCCESS",description=ref));db.commit();db.refresh(pay)
 return {"payment_id":pay.payment_id,"status":pay.status,"transaction_ref":ref,"amount":float(pay.amount)}
