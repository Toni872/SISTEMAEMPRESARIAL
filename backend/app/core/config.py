from pathlib import Path
from typing import List, Union, Optional

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
    from pydantic import field_validator
except ImportError:
    from pydantic import BaseSettings, validator as field_validator

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
    
    @property
    def secret_key_validated(self) -> str:
        """Valida que SECRET_KEY tenga longitud mínima"""
        from .security_utils import validate_secret_key
        if not validate_secret_key(self.SECRET_KEY):
            import warnings
            warnings.warn(
                "SECRET_KEY debe tener al menos 32 caracteres para seguridad adecuada. "
                "Usa: python -c 'import secrets; print(secrets.token_urlsafe(32))' para generar una.",
                UserWarning
            )
        return self.SECRET_KEY

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
    E2E_MODE: bool = False  # Modo E2E: deshabilita rate limiting para tests

    # ──────── SENTRY ───────
    SENTRY_DSN: Optional[str] = None

    # ──────── ENV ───────
    ENV: str = "development"

    # ──────── APP ───────
    PROJECT_NAME: str = "ERP Sistema Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    # ──────── CORS ───────
    # Acepta string separado por comas o JSON array
    BACKEND_CORS_ORIGINS: str = "http://localhost:3001,http://localhost:3000,http://127.0.0.1:3001,http://127.0.0.1:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convierte BACKEND_CORS_ORIGINS a lista"""
        import json
        # Intentar parsear como JSON primero (para compatibilidad)
        try:
            parsed = json.loads(self.BACKEND_CORS_ORIGINS)
            if isinstance(parsed, list):
                return parsed
        except (json.JSONDecodeError, ValueError):
            pass
        # Si no es JSON válido, tratar como string separado por comas
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

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
