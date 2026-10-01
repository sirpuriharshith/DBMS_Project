from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth,properties,bookings,payments,contracts,dashboard,ai
app=FastAPI(title="Rentora API",version="3.0.0",description="Online Rental Contract Booking & Payment System")
app.add_middleware(CORSMiddleware,allow_origin_regex=r"https?://(localhost|127\.0\.0\.1):\d+",allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
app.include_router(auth.router,prefix="/api");app.include_router(properties.router,prefix="/api");app.include_router(bookings.router,prefix="/api");app.include_router(payments.router,prefix="/api");app.include_router(contracts.router,prefix="/api");app.include_router(dashboard.router,prefix="/api");app.include_router(ai.router,prefix="/api")
@app.get("/")
def root(): return {"project":"Rentora","status":"running","docs":"/docs"}
@app.get("/api/health")
def health(): return {"status":"ok","database":"PostgreSQL","project":"Rentora"}
