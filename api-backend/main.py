from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "CyberGuard API Online"}

@app.get("/metrics")
def metrics():
    return {
        "critical_alerts": 5,
        "open_incidents": 12,
        "mitre_techniques": 8,
        "analyst_xp": 200,
        "soc_status": "Operational"
    }