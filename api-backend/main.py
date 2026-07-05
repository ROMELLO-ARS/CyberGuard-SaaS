import psycopg2
from config import POSTGRES_DATABASE_URL

from pathlib import Path
from reportlab.lib import colors
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)



from auth import router as auth_router
from security import require_roles
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
    get_mitre_summary_from_db,
    create_ingested_log_in_db,
    get_ingested_logs_from_db,
    get_ingested_log_by_id,
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

class LogIngestRequest(BaseModel):
    source_type: str = "manual"
    event_time: str | None = None
    source_ip: str | None = None
    destination_ip: str | None = None
    event_type: str | None = None
    severity: str = "Medium"
    message: str
    raw_log: str

class AssistantRequest(BaseModel):
    message: str


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
def get_executive_summary(
    user=Depends(require_roles(["Administrator", "Executive"]))
):
    return get_executive_summary_from_db()

@app.get(
    "/logs",
    dependencies=[
        Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager"]))
    ],
)
def get_logs():
    return get_ingested_logs_from_db()

@app.get("/postgres-test")
def postgres_test():
    try:
        conn = psycopg2.connect(POSTGRES_DATABASE_URL)
        cursor = conn.cursor()

        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return {
            "status": "connected",
            "database": "PostgreSQL",
            "version": version,
        }

    except Exception as error:
        return {
            "status": "failed",
            "database": "PostgreSQL",
            "error": str(error),
        }


@app.post(
    "/logs/ingest",
    dependencies=[
        Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager"]))
    ],
)
def ingest_log(request: LogIngestRequest):
    log_id = create_ingested_log_in_db(
        source_type=request.source_type,
        event_time=request.event_time,
        source_ip=request.source_ip,
        destination_ip=request.destination_ip,
        event_type=request.event_type,
        severity=request.severity,
        message=request.message,
        raw_log=request.raw_log,
    )

    create_audit_log(
        username="system",
        role="System",
        action="Log Ingested",
        details=f"New {request.source_type} log ingested with severity {request.severity}.",
    )

    return {
        "message": "Log ingested successfully",
        "log_id": log_id,
    }


@app.post(
    "/logs/{log_id}/create-incident",
    dependencies=[
        Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager"]))
    ],
)
def create_incident_from_log(log_id: int):
    log = get_ingested_log_by_id(log_id)

    if not log:
        raise HTTPException(status_code=404, detail="Log not found")

    incident_title = f"{log['event_type'] or 'Security Log Event'} - {log['message'][:60]}"
    incident_severity = log["severity"] or "Medium"
    incident_assigned_to = "SOC Analyst"
    incident_source_ip = log["source_ip"] or "Unknown"

    incident_id = create_incident_in_db(
        incident_title,
        incident_severity,
        incident_assigned_to,
        incident_source_ip,
    )

    create_audit_log(
        username="system",
        role="System",
        action="Incident Created From Log",
        details=f"Incident ID {incident_id} created from ingested log ID {log_id}.",
    )

    return {
        "id": incident_id,
        "title": incident_title,
        "severity": incident_severity,
        "assigned_to": incident_assigned_to,
        "source_ip": incident_source_ip,
        "status": "Open",
        "message": "Incident created from log successfully",
    }

@app.get("/alerts")
def get_alerts(
    user=Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager"]))
):
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


@app.get("/incidents")
def get_incidents(
    user=Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager"]))
):
    return get_incidents_from_db()


@app.post("/incidents")
def create_incident(
    request: IncidentCreateRequest,
    user=Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager"])),
):
    incident_id = create_incident_in_db(
        title=request.title,
        severity=request.severity,
        assigned_to=request.assigned_to,
        source_ip=request.source_ip,
    )

    create_audit_log(
        username=user["username"],
        role=user["role"],
        action="Created Incident",
        details=f"Incident #{incident_id} created for {request.title}.",
    )

    return {
        "message": "Incident created successfully",
        "incident_id": incident_id,
    }


@app.patch("/incidents/{incident_id}/status")
def update_incident_status(
    incident_id: int,
    request: IncidentStatusUpdateRequest,
    user=Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager"])),
):
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
        username=user["username"],
        role=user["role"],
        action="Updated Incident Status",
        details=f"Incident #{incident_id} status changed to {request.status}.",
    )

    return {
        "message": "Incident status updated successfully",
        "incident_id": incident_id,
        "status": request.status,
    }


@app.get("/incidents/{incident_id}/notes")
def get_incident_notes(
    incident_id: int,
    user=Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager"])),
):
    return get_notes_for_incident(incident_id)


@app.post("/incidents/{incident_id}/notes")
def create_incident_note(
    incident_id: int,
    request: IncidentNoteCreateRequest,
    user=Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager"])),
):
    note_id = add_note_to_incident(
        incident_id=incident_id,
        analyst=request.analyst,
        note=request.note,
    )

    create_audit_log(
        username=user["username"],
        role=user["role"],
        action="Added Incident Note",
        details=f"Analyst note added to Incident #{incident_id}.",
    )

    return {
        "message": "Incident note added successfully",
        "note_id": note_id,
        "incident_id": incident_id,
    }


@app.get("/audit-logs")
def get_audit_logs(
    user=Depends(require_roles(["Administrator"]))
):
    return get_audit_logs_from_db()

def generate_ai_assistant_response(user_message: str):
    message = user_message.lower()

    metrics = get_real_metrics_from_db()
    executive_summary = get_executive_summary_from_db()
    mitre_summary = get_mitre_summary_from_db()
    incidents = get_incidents_from_db()
    logs = get_ingested_logs_from_db()

    critical_incidents = metrics.get("critical_alerts", 0)
    open_incidents = metrics.get("open_incidents", 0)
    total_incidents = metrics.get("total_incidents", 0)
    security_posture = metrics.get("security_posture", "Unknown")
    soc_status = metrics.get("soc_status", "Unknown")

    if "risk" in message or "posture" in message or "summary" in message:
        return (
            f"CyberGuard currently reports {total_incidents} total incident(s), "
            f"{critical_incidents} critical incident(s), and {open_incidents} open incident(s). "
            f"The current security posture is {security_posture}, and the SOC status is {soc_status}. "
            f"I recommend prioritising Critical and High severity incidents first, then reviewing unresolved Open cases."
        )

    if "prioritize" in message or "priority" in message or "investigate" in message:
        critical = [
            incident for incident in incidents
            if incident.get("severity") == "Critical" and incident.get("status") != "Resolved"
        ]

        if critical:
            first = critical[0]
            return (
                f"Start with the Critical incident: '{first['title']}' from source IP {first['source_ip']}. "
                f"It is currently marked as {first['status']}. Validate the source, check related logs, "
                f"document analyst findings, and move the case through containment or resolution."
            )

        return (
            "There are no unresolved Critical incidents at the moment. "
            "Next, review High severity incidents, then Medium severity items with suspicious source IPs or repeated activity."
        )

    if "mitre" in message or "attack" in message or "technique" in message:
        if mitre_summary:
            top = mitre_summary[0]
            return (
                f"The strongest MITRE mapping currently is {top['id']} — {top['technique']} under the {top['tactic']} tactic. "
                f"It appears in {top['count']} related incident(s). Recommended action: {top['recommendation']}"
            )

        return (
            "No MITRE mappings are available yet. Create incidents from Threat Queue or Log Ingestion so CyberGuard can map activity to ATT&CK techniques."
        )

    if "log" in message or "ingestion" in message or "traffic" in message:
        return (
            f"CyberGuard has ingested {len(logs)} log event(s). "
            "The Log Ingestion module supports realistic firewall, IDS, endpoint, Windows Event, and network telemetry workflows. "
            "For a real-world deployment, this can be extended to syslog, Suricata EVE JSON, Zeek logs, and packet capture analysis."
        )

    if "demo" in message or "guide" in message or "present" in message:
        return (
            "Recommended demo flow: log in as Administrator, review Dashboard metrics, ingest a realistic log, "
            "create an incident from that log, update the incident status, add an analyst note, review the Audit Timeline, "
            "check MITRE mapping, generate the Executive PDF report, then switch roles to demonstrate RBAC."
        )

    if "executive" in message or "report" in message:
        return (
            f"The executive summary reports a security posture of {executive_summary['security_posture']} "
            f"with a score of {executive_summary['security_posture_score']}/100. "
            "Use the Executive page to generate a PDF report for management-level decision support."
        )

    if "rbac" in message or "role" in message or "permission" in message:
        return (
            "CyberGuard uses role-based access control across both the frontend and backend. "
            "Administrators have full access, SOC Analysts can triage threats and incidents, SOC Managers have operational visibility, "
            "and Executives can access reporting, subscriptions, and settings."
        )

    return (
        "I am CyberGuard AI, your SOC assistant. I can help summarize risk, recommend which incident to investigate, "
        "explain MITRE mappings, guide your demo, describe log ingestion, and support executive reporting."
    )

@app.post(
    "/ai/assistant",
    dependencies=[
        Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager", "Executive"]))
    ],
)
def ai_assistant(request: AssistantRequest):
    response = generate_ai_assistant_response(request.message)

    create_audit_log(
        username="assistant",
        role="AI",
        action="AI Assistant Used",
        details=f"Assistant prompt received: {request.message[:100]}",
    )

    return {
        "response": response
    }


@app.get("/mitre")
def get_mitre_summary(
    user=Depends(require_roles(["Administrator", "SOC Analyst", "SOC Manager"]))
):
    return get_mitre_summary_from_db()


@app.get("/executive-report/pdf")
def generate_executive_report_pdf(
    user=Depends(require_roles(["Administrator", "Executive"]))
):
    summary = get_executive_summary_from_db()
    stats = summary["statistics"]

    reports_dir = Path("reports")
    reports_dir.mkdir(exist_ok=True)

    pdf_path = reports_dir / "cyberguard_executive_report.pdf"

    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=letter,
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=45,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "CyberGuardTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=10,
    )

    subtitle_style = ParagraphStyle(
        "CyberGuardSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#475569"),
        spaceAfter=18,
    )

    section_style = ParagraphStyle(
        "CyberGuardSection",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=12,
        spaceAfter=8,
    )

    body_style = ParagraphStyle(
        "CyberGuardBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=15,
        textColor=colors.HexColor("#334155"),
    )

    small_style = ParagraphStyle(
        "CyberGuardSmall",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
    )

    story = []

    story.append(Paragraph("CyberGuard Executive Security Report", title_style))
    story.append(
        Paragraph(
            "Generated from live CyberGuard SQLite SOC data. This report summarises security posture, incident activity, analyst documentation, and audit readiness.",
            subtitle_style,
        )
    )

    posture_color = "#16a34a"
    if summary["security_posture"] == "Moderate Risk":
        posture_color = "#ca8a04"
    elif summary["security_posture"] == "High Risk":
        posture_color = "#dc2626"

    overview_data = [
        ["Security Posture Score", "Current Posture", "Report Status"],
        [
            f"{summary['security_posture_score']}/100",
            summary["security_posture"],
            "Enabled",
        ],
    ]

    overview_table = Table(overview_data, colWidths=[1.9 * inch, 1.9 * inch, 1.9 * inch])
    overview_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 1), (-1, 1), 15),
                ("TEXTCOLOR", (1, 1), (1, 1), colors.HexColor(posture_color)),
                ("BACKGROUND", (0, 1), (-1, 1), colors.HexColor("#f8fafc")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#94a3b8")),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )

    story.append(overview_table)
    story.append(Spacer(1, 18))

    story.append(Paragraph("Key SOC Metrics", section_style))

    metrics_data = [
        ["Metric", "Value", "Meaning"],
        ["Total Incidents", stats["total_incidents"], "All recorded SOC cases"],
        ["Critical Incidents", stats["critical_incidents"], "Highest-priority cases"],
        ["High Incidents", stats["high_incidents"], "High-severity cases requiring review"],
        ["Open Incidents", stats["open_incidents"], "Cases still requiring action"],
        ["Resolved Incidents", stats["resolved_incidents"], "Cases completed"],
        ["Contained Incidents", stats["contained_incidents"], "Cases controlled but not fully closed"],
        ["Analyst Notes", stats["total_notes"], "Investigation documentation entries"],
        ["Audit Events", stats["audit_events"], "Tracked workflow/accountability actions"],
    ]

    metrics_table = Table(metrics_data, colWidths=[1.8 * inch, 1.0 * inch, 3.0 * inch])
    metrics_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("ALIGN", (1, 1), (1, -1), "CENTER"),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )

    story.append(metrics_table)
    story.append(Spacer(1, 18))

    story.append(Paragraph("Executive Summary", section_style))
    story.append(Paragraph(summary["summary"], body_style))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Top Security Risks", section_style))

    for risk in summary["top_risks"]:
        story.append(Paragraph(f"- {risk}", small_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Recommended Actions", section_style))

    for action in summary["recommended_actions"]:
        story.append(Paragraph(f"- {action}", small_style))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    story.append(Paragraph("SOC Maturity Indicators", section_style))

    maturity_data = [["Area", "Status"]]
    for key, value in summary["maturity_indicators"].items():
        maturity_data.append([key.replace("_", " ").title(), value])

    maturity_table = Table(maturity_data, colWidths=[2.5 * inch, 3.2 * inch])
    maturity_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )

    story.append(maturity_table)
    story.append(Spacer(1, 24))

    story.append(Paragraph("Report Interpretation", section_style))
    story.append(
        Paragraph(
            "This report is generated from the operational CyberGuard SaaS database. Incident, note, audit, MITRE, and dashboard data are intended to support SOC decision-making, accountability, and executive communication. The report should be reviewed alongside analyst evidence and incident case notes before final business action is taken.",
            body_style,
        )
    )

    def add_footer(canvas_obj, doc_obj):
        canvas_obj.saveState()
        canvas_obj.setFont("Helvetica", 8)
        canvas_obj.setFillColor(colors.HexColor("#64748b"))
        canvas_obj.drawString(50, 25, "CyberGuard SaaS SOC Platform")
        canvas_obj.drawRightString(560, 25, f"Page {doc_obj.page}")
        canvas_obj.restoreState()

    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)

    return FileResponse(
        path=str(pdf_path),
        filename="cyberguard_executive_report.pdf",
        media_type="application/pdf",
    )

