import sqlite3
from pathlib import Path

DB_PATH = Path("cyberguard_saas.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            severity TEXT NOT NULL,
            assigned_to TEXT NOT NULL,
            status TEXT NOT NULL,
            source_ip TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS incident_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER NOT NULL,
            analyst TEXT NOT NULL,
            note TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (incident_id) REFERENCES incidents (id)
        )
        """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            role TEXT NOT NULL,
            action TEXT NOT NULL,
            details TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS ingested_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_type TEXT NOT NULL,
        event_time TEXT,
        source_ip TEXT,
        destination_ip TEXT,
        event_type TEXT,
        severity TEXT,
        message TEXT NOT NULL,
        raw_log TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """
)

    conn.commit()
    conn.close()


def seed_incidents():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM incidents")
    count = cursor.fetchone()[0]

    if count == 0:
        cursor.executemany(
            """
            INSERT INTO incidents
            (title, severity, assigned_to, status, source_ip, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            [
                (
                    "SSH Brute Force Investigation",
                    "Critical",
                    "analyst",
                    "Open",
                    "203.0.113.45",
                    "2026-06-07 19:30",
                ),
                (
                    "Malware C2 Traffic Review",
                    "High",
                    "admin",
                    "Investigating",
                    "198.51.100.22",
                    "2026-06-07 19:45",
                ),
            ],
        )

    conn.commit()
    conn.close()


def get_incidents_from_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM incidents ORDER BY id DESC")
    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


def create_incident_in_db(title, severity, assigned_to, source_ip):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO incidents
        (title, severity, assigned_to, status, source_ip, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
        """,
        (
            title,
            severity,
            assigned_to,
            "Open",
            source_ip,
        ),
    )

    conn.commit()
    incident_id = cursor.lastrowid
    conn.close()

    return incident_id


def update_incident_status_in_db(incident_id, status):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE incidents
        SET status = ?
        WHERE id = ?
        """,
        (status, incident_id),
    )

    conn.commit()
    updated_rows = cursor.rowcount
    conn.close()

    return updated_rows


def get_notes_for_incident(incident_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT * FROM incident_notes
        WHERE incident_id = ?
        ORDER BY id DESC
        """,
        (incident_id,),
    )

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


def add_note_to_incident(incident_id, analyst, note):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO incident_notes
        (incident_id, analyst, note, created_at)
        VALUES (?, ?, ?, datetime('now'))
        """,
        (incident_id, analyst, note),
    )

    conn.commit()
    note_id = cursor.lastrowid
    conn.close()

    return note_id


def create_audit_log(username, role, action, details):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO audit_logs
        (username, role, action, details, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        """,
        (username, role, action, details),
    )

    conn.commit()
    audit_id = cursor.lastrowid
    conn.close()

    return audit_id


def get_audit_logs_from_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            created_at AS timestamp,
            username,
            role,
            action,
            details
        FROM audit_logs
        ORDER BY id DESC
        """
    )

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]

def get_real_metrics_from_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM incidents")
    total_incidents = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE status = 'Open'")
    open_incidents = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE severity = 'Critical'")
    critical_alerts = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incident_notes")
    total_notes = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM audit_logs")
    audit_events = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE status = 'Resolved'")
    resolved_incidents = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE status = 'Contained'")
    contained_incidents = cursor.fetchone()[0]

    conn.close()

    if critical_alerts >= 5 or open_incidents >= 10:
        security_posture = "High Risk"
        soc_status = "Needs Attention"
    elif critical_alerts >= 2 or open_incidents >= 5:
        security_posture = "Moderate Risk"
        soc_status = "Monitoring"
    else:
        security_posture = "Stable"
        soc_status = "Operational"

    analyst_xp = total_notes * 25 + resolved_incidents * 50 + contained_incidents * 35

    return {
        "critical_alerts": critical_alerts,
        "open_incidents": open_incidents,
        "total_incidents": total_incidents,
        "audit_events": audit_events,
        "total_notes": total_notes,
        "emergency_events": 0,
        "mitre_techniques": 8,
        "analyst_xp": analyst_xp,
        "security_posture": security_posture,
        "soc_status": soc_status,
    }

def get_dashboard_analytics_from_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT severity AS name, COUNT(*) AS value
        FROM incidents
        GROUP BY severity
        ORDER BY value DESC
        """
    )
    threat_distribution = [dict(row) for row in cursor.fetchall()]

    cursor.execute(
        """
        SELECT status AS name, COUNT(*) AS value
        FROM incidents
        GROUP BY status
        ORDER BY value DESC
        """
    )
    status_distribution = [dict(row) for row in cursor.fetchall()]

    cursor.execute(
        """
        SELECT assigned_to AS name, COUNT(*) AS incidents
        FROM incidents
        GROUP BY assigned_to
        ORDER BY incidents DESC
        """
    )
    analyst_workload = [dict(row) for row in cursor.fetchall()]

    cursor.execute(
        """
        SELECT DATE(created_at) AS day, COUNT(*) AS incidents
        FROM incidents
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
        """
    )
    incident_trend = [dict(row) for row in cursor.fetchall()]

    cursor.execute(
        """
        SELECT DATE(created_at) AS day, COUNT(*) AS events
        FROM audit_logs
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
        """
    )
    audit_trend = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return {
        "threat_distribution": threat_distribution,
        "status_distribution": status_distribution,
        "analyst_workload": analyst_workload,
        "incident_trend": incident_trend,
        "audit_trend": audit_trend,
    }

def get_executive_summary_from_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM incidents")
    total_incidents = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE severity = 'Critical'")
    critical_incidents = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE severity = 'High'")
    high_incidents = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE status = 'Open'")
    open_incidents = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE status = 'Resolved'")
    resolved_incidents = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE status = 'Contained'")
    contained_incidents = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incident_notes")
    total_notes = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM audit_logs")
    audit_events = cursor.fetchone()[0]

    cursor.execute(
        """
        SELECT title, severity, status, source_ip
        FROM incidents
        WHERE severity IN ('Critical', 'High')
        ORDER BY id DESC
        LIMIT 4
        """
    )
    high_risk_incidents = [dict(row) for row in cursor.fetchall()]

    conn.close()

    risk_score = 100

    risk_score -= critical_incidents * 12
    risk_score -= high_incidents * 7
    risk_score -= open_incidents * 5
    risk_score += resolved_incidents * 6
    risk_score += contained_incidents * 4

    security_posture_score = max(0, min(100, risk_score))

    if security_posture_score >= 80:
        security_posture = "Stable"
    elif security_posture_score >= 60:
        security_posture = "Moderate Risk"
    else:
        security_posture = "High Risk"

    top_risks = []

    if critical_incidents > 0:
        top_risks.append(
            f"{critical_incidents} critical incident(s) require priority SOC review."
        )

    if high_incidents > 0:
        top_risks.append(
            f"{high_incidents} high-severity incident(s) may require escalation."
        )

    if open_incidents > 0:
        top_risks.append(
            f"{open_incidents} open incident(s) remain unresolved."
        )

    for incident in high_risk_incidents:
        top_risks.append(
            f"{incident['severity']} incident: {incident['title']} from source IP {incident['source_ip']}."
        )

    if not top_risks:
        top_risks.append("No major unresolved risks detected at this time.")

    recommended_actions = [
        "Prioritise Critical and High incidents for analyst review.",
        "Ensure analyst notes are added for every active investigation.",
        "Review audit logs for accountability and workflow traceability.",
        "Move contained or resolved incidents through closure procedures.",
    ]

    if open_incidents >= 3:
        recommended_actions.append(
            "Reduce the open incident backlog to improve SOC response maturity."
        )

    if total_notes == 0:
        recommended_actions.append(
            "Add investigation notes to improve evidence tracking and reporting."
        )

    summary = (
        f"CyberGuard currently reports {total_incidents} total incident(s), "
        f"including {critical_incidents} critical incident(s), {high_incidents} high-severity incident(s), "
        f"and {open_incidents} open incident(s). The current security posture is {security_posture} "
        f"with a score of {security_posture_score}/100. The system has recorded "
        f"{audit_events} audit event(s) and {total_notes} analyst note(s), supporting traceability, "
        f"incident accountability, and executive-level reporting."
    )

    return {
        "security_posture_score": security_posture_score,
        "security_posture": security_posture,
        "summary": summary,
        "top_risks": top_risks[:6],
        "recommended_actions": recommended_actions,
        "maturity_indicators": {
            "threat_detection": "Active" if total_incidents > 0 else "Developing",
            "incident_response": "Active" if open_incidents > 0 else "Stable",
            "audit_readiness": "Enabled" if audit_events > 0 else "Developing",
            "executive_reporting": "Enabled",
        },
        "statistics": {
            "total_incidents": total_incidents,
            "critical_incidents": critical_incidents,
            "high_incidents": high_incidents,
            "open_incidents": open_incidents,
            "resolved_incidents": resolved_incidents,
            "contained_incidents": contained_incidents,
            "total_notes": total_notes,
            "audit_events": audit_events,
        },
    }

def get_mitre_summary_from_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            title,
            severity,
            status,
            source_ip
        FROM incidents
        ORDER BY id DESC
        """
    )

    incidents = [dict(row) for row in cursor.fetchall()]
    conn.close()

    mitre_map = {
        "Brute Force": {
            "id": "T1110",
            "technique": "Brute Force",
            "tactic": "Credential Access",
            "description": "Repeated login attempts may indicate password guessing or credential attacks.",
            "recommendation": "Review authentication logs, block suspicious source IPs, and enforce MFA.",
        },
        "Malware": {
            "id": "T1071",
            "technique": "Application Layer Protocol",
            "tactic": "Command and Control",
            "description": "Suspicious outbound communication may indicate command-and-control activity.",
            "recommendation": "Review outbound traffic, isolate affected endpoints, and inspect DNS or HTTP traffic.",
        },
        "Ransomware": {
            "id": "T1486",
            "technique": "Data Encrypted for Impact",
            "tactic": "Impact",
            "description": "Potential ransomware behaviour involving encryption or disruption of data availability.",
            "recommendation": "Isolate affected systems, preserve evidence, and begin ransomware containment procedures.",
        },
        "Exfiltration": {
            "id": "T1567",
            "technique": "Exfiltration Over Web Service",
            "tactic": "Exfiltration",
            "description": "Possible data exfiltration using outbound web-based transfer channels.",
            "recommendation": "Review outbound transfer volume, destination reputation, and sensitive data movement.",
        },
    }

    summary = {}

    for incident in incidents:
        title = incident["title"]

        matched_key = None

        for keyword in mitre_map:
            if keyword.lower() in title.lower():
                matched_key = keyword
                break

        if not matched_key:
            matched_key = "Brute Force"

        mitre = mitre_map[matched_key]
        mitre_id = mitre["id"]

        if mitre_id not in summary:
            summary[mitre_id] = {
                "id": mitre["id"],
                "technique": mitre["technique"],
                "tactic": mitre["tactic"],
                "count": 0,
                "severity": incident["severity"],
                "description": mitre["description"],
                "recommendation": mitre["recommendation"],
                "related_incidents": [],
            }

        summary[mitre_id]["count"] += 1
        summary[mitre_id]["related_incidents"].append(
            {
                "title": incident["title"],
                "severity": incident["severity"],
                "status": incident["status"],
                "source_ip": incident["source_ip"],
            }
        )

        if incident["severity"] == "Critical":
            summary[mitre_id]["severity"] = "Critical"
        elif incident["severity"] == "High" and summary[mitre_id]["severity"] != "Critical":
            summary[mitre_id]["severity"] = "High"

    return list(summary.values())

  
def create_ingested_log_in_db(
    source_type,
    event_time,
    source_ip,
    destination_ip,
    event_type,
    severity,
    message,
    raw_log,
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO ingested_logs (
            source_type,
            event_time,
            source_ip,
            destination_ip,
            event_type,
            severity,
            message,
            raw_log
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            source_type,
            event_time,
            source_ip,
            destination_ip,
            event_type,
            severity,
            message,
            raw_log,
        ),
    )

    conn.commit()
    log_id = cursor.lastrowid
    conn.close()

    return log_id


def get_ingested_logs_from_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM ingested_logs
        ORDER BY id DESC
        """
    )

    logs = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return logs


def get_ingested_log_by_id(log_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM ingested_logs
        WHERE id = ?
        """,
        (log_id,),
    )

    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return dict(row)