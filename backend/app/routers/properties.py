from decimal import Decimal
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Property,Activity,Booking
from ..schemas import PropertyCreate
from ..deps import require_roles
router=APIRouter(prefix="/properties",tags=["Properties"])
def out(p): return {"property_id":p.property_id,"owner_id":p.owner_id,"title":p.title,"description":p.description,"property_type":p.property_type,"city":p.city,"area":p.area,"address":p.address,"latitude":float(p.latitude) if p.latitude is not None else None,"longitude":float(p.longitude) if p.longitude is not None else None,"monthly_rent":p.monthly_rent,"bedrooms":p.bedrooms,"bathrooms":p.bathrooms,"furnished":p.furnished,"image_url":p.image_url,"status":p.status}
@router.get("")
def list_properties(q:str="",city:str="",property_type:str="",min_rent:Decimal|None=None,max_rent:Decimal|None=None,bedrooms:int|None=None,status:str="AVAILABLE",db:Session=Depends(get_db)):
    query=db.query(Property)
    if status: query=query.filter(Property.status==status.upper())
    if q:
        x=f"%{q}%";query=query.filter(or_(Property.title.ilike(x),Property.city.ilike(x),Property.area.ilike(x),Property.description.ilike(x)))
    if city: query=query.filter(Property.city.ilike(f"%{city}%"))
    if property_type: query=query.filter(Property.property_type==property_type.upper())
    if min_rent is not None: query=query.filter(Property.monthly_rent>=min_rent)
    if max_rent is not None: query=query.filter(Property.monthly_rent<=max_rent)
    if bedrooms is not None: query=query.filter(Property.bedrooms>=bedrooms)
    return [out(p) for p in query.order_by(Property.created_at.desc()).all()]
@router.get("/owner/me")
def owner_properties(user=Depends(require_roles("OWNER")),db:Session=Depends(get_db)): return [out(p) for p in db.query(Property).filter(Property.owner_id==user.user_id).order_by(Property.created_at.desc()).all()]
@router.get("/{property_id}")
def get_property(property_id:int,db:Session=Depends(get_db)):
    p=db.get(Property,property_id)
    if not p: raise HTTPException(404,"Property not found")
    return out(p)
@router.post("")
def create_property(data:PropertyCreate,user=Depends(require_roles("OWNER")),db:Session=Depends(get_db)):
    p=Property(owner_id=user.user_id,**data.model_dump());db.add(p);db.flush();db.add(Activity(user_id=user.user_id,action="PROPERTY_CREATED",description=p.title));db.commit();db.refresh(p);return out(p)
@router.put("/{property_id}")
def update_property(property_id:int,data:PropertyCreate,user=Depends(require_roles("OWNER","ADMIN")),db:Session=Depends(get_db)):
    p=db.get(Property,property_id)
    if not p: raise HTTPException(404,"Property not found")
    if user.role=="OWNER" and p.owner_id!=user.user_id: raise HTTPException(403,"You do not own this property")
    for k,v in data.model_dump().items(): setattr(p,k,v)
    db.add(Activity(user_id=user.user_id,action="PROPERTY_UPDATED",description=p.title));db.commit();db.refresh(p);return out(p)
@router.delete("/{property_id}")
def delete_property(property_id:int,user=Depends(require_roles("OWNER","ADMIN")),db:Session=Depends(get_db)):
    p=db.get(Property,property_id)
    if not p: raise HTTPException(404,"Property not found")
    if user.role=="OWNER" and p.owner_id!=user.user_id: raise HTTPException(403,"You do not own this property")
    booking_exists=db.query(Booking.booking_id).filter(Booking.property_id==property_id).first()
    if booking_exists: raise HTTPException(409,"This property has booking history and cannot be deleted. Cancel or complete the booking first.")
    title=p.title;db.delete(p);db.add(Activity(user_id=user.user_id,action="PROPERTY_DELETED",description=title));db.commit();return {"message":"Property deleted"}
