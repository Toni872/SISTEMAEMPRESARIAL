"""
Configuración para integración con AEAT
Variables de entorno y configuración para servicios AEAT
"""
from pydantic_settings import BaseSettings
from typing import Optional


class AEATSettings(BaseSettings):
    """Configuración para servicios AEAT"""
    
    # URLs de servicios
    AEAT_SANDBOX_URL: str = "https://www.agenciatributaria.gob.es/static_files/AEAT/Desarrolladores/Servicios_Web/Verifactu/sandbox"
    AEAT_PRODUCTION_URL: str = "https://sede.agenciatributaria.gob.es/verifactu/api"
    
    # Modo de operación
    AEAT_USE_SANDBOX: bool = True  # Cambiar a False en producción
    
    # Certificado por defecto
    AEAT_DEFAULT_CERTIFICATE_PATH: Optional[str] = None
    AEAT_DEFAULT_CERTIFICATE_PASSWORD: Optional[str] = None
    
    # Timeouts
    AEAT_REQUEST_TIMEOUT: int = 30  # segundos
    
    # Reintentos
    AEAT_MAX_RETRIES: int = 3
    AEAT_RETRY_DELAY: int = 5  # segundos
    
    # Directorio de certificados
    CERTIFICATES_DIR: str = "/app/certificates"
    
    class Config:
        env_prefix = "AEAT_"
        case_sensitive = False


# Instancia global de configuración
aeat_settings = AEATSettings()

