from fastapi import FastAPI

app = FastAPI(
    title="CyberGuard SaaS API",
    description="FastAPI backend for the CyberGuard React SaaS platform",
    version="1.0.0",
)


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
        "critical_alerts": 0,
        "open_incidents": 0,
        "audit_events": 0,
        "emergency_events": 0,
        "security_posture": "Stable",
    }