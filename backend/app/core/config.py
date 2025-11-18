from pathlib import Path
from typing import List, Union

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

    # ──────── SECURITY ───────
    PASSWORD_HASH_ALGORITHM: str = "bcrypt"

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
