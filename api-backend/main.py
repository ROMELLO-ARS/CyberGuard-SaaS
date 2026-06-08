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

@app.get("/mitre")
def get_mitre_summary():
    return [
        {
            "id": "T1110",
            "technique": "Brute Force",
            "tactic": "Credential Access",
            "count": 6,
            "severity": "Critical",
            "description": "Repeated login attempts may indicate password guessing or credential attacks.",
        },
        {
            "id": "T1071",
            "technique": "Application Layer Protocol",
            "tactic": "Command and Control",
            "count": 4,
            "severity": "High",
            "description": "Suspicious outbound communication may indicate command-and-control activity.",
        },
        {
            "id": "T1486",
            "technique": "Data Encrypted for Impact",
            "tactic": "Impact",
            "count": 3,
            "severity": "Critical",
            "description": "Potential ransomware behaviour involving encryption or disruption of data availability.",
        },
        {
            "id": "T1567",
            "technique": "Exfiltration Over Web Service",
            "tactic": "Exfiltration",
            "count": 2,
            "severity": "Medium",
            "description": "Possible data exfiltration using outbound web-based transfer channels.",
        },
    ]

@app.get("/executive-summary")
def get_executive_summary():
    return {
        "security_posture_score": 82,
        "security_posture": "Moderate Risk",
        "summary": (
            "CyberGuard has identified multiple high-priority security events, "
            "including credential access attempts, command-and-control indicators, "
            "and ransomware-related impact activity. Analyst response is recommended "
            "for all critical and high-risk alerts."
        ),
        "top_risks": [
            "Credential access attempts against exposed services",
            "Possible malware command-and-control traffic",
            "Ransomware activity affecting internal hosts",
            "Suspicious outbound data transfer patterns",
        ],
        "recommended_actions": [
            "Prioritise all Critical alerts in the Threat Queue",
            "Create incident cases for confirmed high-risk activity",
            "Review MITRE ATT&CK mappings for recurring tactics",
            "Escalate ransomware indicators to SOC management",
        ],
        "maturity_indicators": {
            "threat_detection": "Active",
            "incident_response": "Developing",
            "audit_readiness": "Enabled",
            "executive_reporting": "Enabled",
        },
    }

@app.get("/audit-logs")
def get_audit_logs():
    return [
        {
            "id": 1,
            "timestamp": "2026-06-07 19:50",
            "username": "admin",
            "role": "Administrator",
            "action": "Logged In",
            "details": "Administrator accessed CyberGuard SaaS dashboard.",
        },
        {
            "id": 2,
            "timestamp": "2026-06-07 19:55",
            "username": "analyst",
            "role": "SOC Analyst",
            "action": "Reviewed Alert",
            "details": "Analyst reviewed Critical SSH Brute Force alert mapped to T1110.",
        },
        {
            "id": 3,
            "timestamp": "2026-06-07 20:05",
            "username": "admin",
            "role": "Administrator",
            "action": "Created Incident",
            "details": "Incident case created for ransomware activity affecting internal host.",
        },
        {
            "id": 4,
            "timestamp": "2026-06-07 20:15",
            "username": "analyst",
            "role": "SOC Analyst",
            "action": "Updated Case Status",
            "details": "Malware C2 investigation changed from Open to Investigating.",
        },
    ]

@app.get("/dashboard-analytics")
def get_dashboard_analytics():
    return {
        "threat_distribution": [
            {"name": "Critical", "value": 5},
            {"name": "High", "value": 8},
            {"name": "Medium", "value": 12},
            {"name": "Low", "value": 4},
        ],
        "incident_trend": [
            {"day": "Mon", "incidents": 3},
            {"day": "Tue", "incidents": 5},
            {"day": "Wed", "incidents": 4},
            {"day": "Thu", "incidents": 7},
            {"day": "Fri", "incidents": 6},
            {"day": "Sat", "incidents": 2},
            {"day": "Sun", "incidents": 4},
        ],
    }