import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

DATABASE_ENGINE = os.getenv("DATABASE_ENGINE", "sqlite")

SQLITE_DATABASE = os.getenv("SQLITE_DATABASE", "cyberguard_saas.db")

POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "cyberguard_db")
POSTGRES_USER = os.getenv("POSTGRES_USER", "cyberguard")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "CyberGuard123")

BASE_DIR = Path(__file__).resolve().parent

SQLITE_DB_PATH = BASE_DIR / SQLITE_DATABASE

POSTGRES_DATABASE_URL = (
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)