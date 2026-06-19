from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auth import router as auth_router
from database import (
    init_db,
    seed_incidents,
    get_incidents_from_db,
    create_incident_in_db,
    update_incident_status_in_db,
    get_notes_for_incident,
    add_note_to_incident,
    create_audit_log,
    get_audit_logs_from_db,
    get_real_metrics_from_db,
    get_dashboard_analytics_from_db,
    get_executive_summary_from_db,
)


app = FastAPI(
    title="CyberGuard SaaS API",
    description="FastAPI backend for the CyberGuard React SaaS platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

init_db()
seed_incidents()


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "CyberGuard SaaS API",
        "message": "Backend is running successfully",
    }


@app.get("/metrics")
def get_metrics():
    return get_real_metrics_from_db()


@app.get("/dashboard-analytics")
def get_dashboard_analytics():
    return get_dashboard_analytics_from_db()

@app.get("/executive-summary")
def get_executive_summary():
    return get_executive_summary_from_db()

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


class IncidentCreateRequest(BaseModel):
    title: str
    severity: str
    assigned_to: str
    source_ip: str


class IncidentStatusUpdateRequest(BaseModel):
    status: str
    username: str = "system"
    role: str = "System"


class IncidentNoteCreateRequest(BaseModel):
    analyst: str
    note: str


@app.get("/incidents")
def get_incidents():
    return get_incidents_from_db()


@app.post("/incidents")
def create_incident(request: IncidentCreateRequest):
    incident_id = create_incident_in_db(
        title=request.title,
        severity=request.severity,
        assigned_to=request.assigned_to,
        source_ip=request.source_ip,
    )

    create_audit_log(
        username=request.assigned_to,
        role="SOC Analyst",
        action="Created Incident",
        details=f"Incident #{incident_id} created for {request.title}.",
    )

    return {
        "message": "Incident created successfully",
        "incident_id": incident_id,
    }


@app.patch("/incidents/{incident_id}/status")
def update_incident_status(incident_id: int, request: IncidentStatusUpdateRequest):
    updated_rows = update_incident_status_in_db(
        incident_id=incident_id,
        status=request.status,
    )

    if updated_rows == 0:
        return {
            "message": "Incident not found",
            "incident_id": incident_id,
        }

    create_audit_log(
        username=request.username,
        role=request.role,
        action="Updated Incident Status",
        details=f"Incident #{incident_id} status changed to {request.status}.",
    )

    return {
        "message": "Incident status updated successfully",
        "incident_id": incident_id,
        "status": request.status,
    }


@app.get("/incidents/{incident_id}/notes")
def get_incident_notes(incident_id: int):
    return get_notes_for_incident(incident_id)


@app.post("/incidents/{incident_id}/notes")
def create_incident_note(incident_id: int, request: IncidentNoteCreateRequest):
    note_id = add_note_to_incident(
        incident_id=incident_id,
        analyst=request.analyst,
        note=request.note,
    )

    create_audit_log(
        username=request.analyst,
        role="SOC Analyst",
        action="Added Incident Note",
        details=f"Analyst note added to Incident #{incident_id}.",
    )

    return {
        "message": "Incident note added successfully",
        "note_id": note_id,
        "incident_id": incident_id,
    }


@app.get("/audit-logs")
def get_audit_logs():
    return get_audit_logs_from_db()