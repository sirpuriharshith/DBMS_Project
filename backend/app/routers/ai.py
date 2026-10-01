import os
from fastapi import APIRouter
from ..schemas import ChatIn
router=APIRouter(prefix="/ai",tags=["AI Assistant"])
def local(q):
    q=q.lower()
    if "book" in q:return "To book on Rentora, open an available property, choose your move-in date and continue to payment and the digital contract."
    if "owner" in q and ("add" in q or "property" in q):return "Owners register as OWNER, sign in, open Owner Dashboard and use Add Property. The listing is stored in PostgreSQL."
    if "payment" in q:return "Rentora records the booking payment in PostgreSQL. The local version uses a demo transaction; Razorpay can replace it later."
    if "contract" in q:return "After payment, Rentora creates a digital rental contract with a unique contract number and signing status."
    if "map" in q or "distance" in q:return "Use the Maps page to view property locations and open Google Maps directions. The Compare page helps compare rental options."
    if "admin" in q:return "The Admin Dashboard reads platform statistics and recent activity from PostgreSQL."
    return "I am the Rentora Assistant. Ask about properties, owners, tenants, bookings, payments, contracts, admin, maps or the website."
@router.post("/chat")
def chat(data:ChatIn):
    key=os.getenv("OPENAI_API_KEY","").strip()
    if key:
        try:
            from openai import OpenAI
            client=OpenAI(api_key=key)
            r=client.responses.create(model=os.getenv("OPENAI_MODEL","gpt-5.6-luna"),instructions="You are the Rentora website assistant. Answer only questions about Rentora properties, tenants, owners, bookings, payments, contracts, administration and maps.",input=data.message)
            return {"reply":r.output_text}
        except Exception:
            pass
    return {"reply":local(data.message)}
