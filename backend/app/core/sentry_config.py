"""
Configuración de Sentry para el backend
"""
try:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
    from sentry_sdk.integrations.logging import LoggingIntegration
    SENTRY_AVAILABLE = True
except ImportError:
    SENTRY_AVAILABLE = False
    # Si Sentry no está disponible, crear funciones dummy
    class DummySentry:
        @staticmethod
        def init(*args, **kwargs):
            pass
    
    sentry_sdk = DummySentry()
    FastApiIntegration = None
    SqlalchemyIntegration = None
    LoggingIntegration = None

from .config import settings


def init_sentry():
    """
    Inicializa Sentry para el backend
    
    Para usar Sentry:
    1. Crea una cuenta en https://sentry.io
    2. Crea un proyecto para Python/FastAPI
    3. Copia el DSN y configúralo en SENTRY_DSN en .env
    4. O configura la variable en tu plataforma de despliegue
    """
    if not SENTRY_AVAILABLE:
        return
    
    if not settings.SENTRY_DSN:
        return
    
    # Preparar integraciones solo si están disponibles
    integrations = []
    if FastApiIntegration:
        integrations.append(FastApiIntegration(transaction_style="endpoint"))
    if SqlalchemyIntegration:
        integrations.append(SqlalchemyIntegration())
    if LoggingIntegration:
        integrations.append(LoggingIntegration(
            level=None,  # Captura todos los niveles
            event_level=None  # Solo eventos de nivel ERROR y superior
        ))
    
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENV or "development",
        traces_sample_rate=1.0 if settings.ENV == "development" else 0.1,
        profiles_sample_rate=1.0 if settings.ENV == "development" else 0.1,
        
        # Integraciones
        integrations=integrations,
        
        # Ignorar errores específicos
        ignore_errors=[
            # Errores de validación que son esperados
            "ValidationError",
            "NotFoundError",
            "AuthenticationError",
            "AuthorizationError",
        ],
        
        # Configuración adicional
        send_default_pii=False,  # No enviar información personal identificable por defecto
        attach_stacktrace=True,
        max_breadcrumbs=50,
    )

