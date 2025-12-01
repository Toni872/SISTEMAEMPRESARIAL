from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Depends
from typing import List, Callable
from functools import wraps
from .config import settings

limiter = Limiter(key_func=get_remote_address)

def get_rate_limit():
    """Retorna el límite de rate limiting según configuración"""
    if settings.RATE_LIMIT_ENABLED:
        return f"{settings.RATE_LIMIT_PER_MINUTE}/minute"
    return None

def get_rate_limit_dependency(limit: str) -> List:
    """Retorna la dependencia de rate limiting solo si está habilitado y no estamos en modo E2E"""
    if settings.RATE_LIMIT_ENABLED and not settings.E2E_MODE:
        return [Depends(limiter.limit(limit))]
    return []

def conditional_rate_limit(limit: str):
    """Decorador condicional para rate limiting"""
    def decorator(func: Callable) -> Callable:
        if settings.RATE_LIMIT_ENABLED and not settings.E2E_MODE:
            return limiter.limit(limit)(func)
        return func
    return decorator


