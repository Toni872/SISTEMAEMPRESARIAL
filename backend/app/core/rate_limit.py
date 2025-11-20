from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from .config import settings

limiter = Limiter(key_func=get_remote_address)

def get_rate_limit():
    """Retorna el límite de rate limiting según configuración"""
    if settings.RATE_LIMIT_ENABLED:
        return f"{settings.RATE_LIMIT_PER_MINUTE}/minute"
    return None


