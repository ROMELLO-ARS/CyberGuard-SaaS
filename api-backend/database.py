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