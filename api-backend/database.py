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