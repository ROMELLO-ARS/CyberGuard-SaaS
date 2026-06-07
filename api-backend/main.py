from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router

app = FastAPI(
    title="CyberGuard SaaS API",
    description="FastAPI backend for the CyberGuard React SaaS platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "CyberGuard SaaS API",
        "message": "Backend is running successfully",
    }


@app.get("/metrics")
def get_metrics():
    return {
        "critical_alerts": 5,
        "open_incidents": 12,
        "audit_events": 0,
        "emergency_events": 0,
        "mitre_techniques": 8,
        "analyst_xp": 200,
        "security_posture": "Stable",
        "soc_status": "Operational",
    }