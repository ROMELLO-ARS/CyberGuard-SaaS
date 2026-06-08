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

@app.get("/alerts")
def get_alerts():
    return [
        {
            "id": 1,
            "risk_level": "Critical",
            "src_ip": "203.0.113.45",
            "dest_ip": "10.0.0.15",
            "signature": "Simulated SSH Brute Force Attack",
            "mitre_id": "T1110",
            "mitre_tactic": "Credential Access",
            "status": "Open",
            "recommendation": "Investigate source IP and review authentication logs.",
        },
        {
            "id": 2,
            "risk_level": "High",
            "src_ip": "198.51.100.22",
            "dest_ip": "10.0.0.32",
            "signature": "Possible Malware Command and Control Traffic",
            "mitre_id": "T1071",
            "mitre_tactic": "Command and Control",
            "status": "Open",
            "recommendation": "Review outbound traffic and isolate affected endpoint if required.",
        },
        {
            "id": 3,
            "risk_level": "Critical",
            "src_ip": "192.0.2.88",
            "dest_ip": "10.0.0.44",
            "signature": "Ransomware Activity Detected",
            "mitre_id": "T1486",
            "mitre_tactic": "Impact",
            "status": "Investigating",
            "recommendation": "Isolate affected host and begin ransomware containment playbook.",
        },
        {
            "id": 4,
            "risk_level": "Medium",
            "src_ip": "203.0.113.90",
            "dest_ip": "10.0.0.55",
            "signature": "Suspicious Data Exfiltration Pattern",
            "mitre_id": "T1567",
            "mitre_tactic": "Exfiltration",
            "status": "Open",
            "recommendation": "Review outbound transfer volume and destination reputation.",
        },
    ]

    INCIDENTS = [
    {
        "id": 1,
        "title": "SSH Brute Force Investigation",
        "severity": "Critical",
        "assigned_to": "analyst",
        "status": "Open",
        "source_ip": "203.0.113.45",
        "created_at": "2026-06-07 19:30",
    },
    {
        "id": 2,
        "title": "Malware C2 Traffic Review",
        "severity": "High",
        "assigned_to": "admin",
        "status": "Investigating",
        "source_ip": "198.51.100.22",
        "created_at": "2026-06-07 19:45",
    },
]
@app.get("/incidents")
def get_incidents():
    return INCIDENTS