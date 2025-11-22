from pathlib import Path
from typing import List, Union, Optional

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseSettings

    SettingsConfigDict = None
from pydantic import PostgresDsn

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # ──────── DB ────────
    # Permitir tanto PostgreSQL como SQLite para tests
    DATABASE_URL: Union[PostgresDsn, str]

    # ─────── JWT ───────
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ──────── SECURITY ───────
    PASSWORD_HASH_ALGORITHM: str = "bcrypt"

    # ──────── EMAIL ───────
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@erp.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_FROM_NAME: str = "ERP Sistema"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True
    
    # ──────── VERIFACTU/AEAT ───────
    VERIFACTU_CERTIFICATES_DIR: str = "certificates"
    AEAT_BASE_URL: str = "https://sede.agenciatributaria.gob.es/verifactu/api"
    AEAT_CERTIFICATE_PATH: Optional[str] = None
    AEAT_CERTIFICATE_PASSWORD: Optional[str] = None
    AEAT_AUTO_SEND: bool = False

    # ──────── RATE LIMITING ───────
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60

    # ──────── ENV ───────
    ENV: str = "development"

    # ──────── APP ───────
    PROJECT_NAME: str = "ERP Sistema Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    # ──────── CORS ───────
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3000",
        "https://frontend-next-silk-inky.vercel.app",  # Producción Vercel
        "https://frontend-next-silk-inky-*.vercel.app",  # Preview deployments
    ]

    if SettingsConfigDict:
        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            case_sensitive=False,
            extra="ignore",
        )
    else:

        class Config:
            env_file = ".env"
            env_file_encoding = "utf-8"
            case_sensitive = False
            extra = "ignore"


settings = Settings()
