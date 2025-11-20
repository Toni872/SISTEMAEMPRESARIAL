"""
Excepciones personalizadas para la aplicación
"""
from fastapi import HTTPException, status
from typing import Any, Dict, Optional


class BaseAPIException(HTTPException):
    """Excepción base para errores de la API"""
    
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: Optional[str] = None,
        extra_data: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.extra_data = extra_data or {}


class NotFoundError(BaseAPIException):
    """Recurso no encontrado"""
    
    def __init__(self, resource: str, resource_id: Optional[Any] = None):
        detail = f"{resource} no encontrado"
        if resource_id:
            detail += f" (ID: {resource_id})"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code="NOT_FOUND"
        )


class ValidationError(BaseAPIException):
    """Error de validación"""
    
    def __init__(self, detail: str, field: Optional[str] = None):
        if field:
            detail = f"Error de validación en '{field}': {detail}"
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
            error_code="VALIDATION_ERROR",
            extra_data={"field": field} if field else {}
        )


class AuthenticationError(BaseAPIException):
    """Error de autenticación"""
    
    def __init__(self, detail: str = "Credenciales inválidas"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code="AUTHENTICATION_ERROR"
        )


class AuthorizationError(BaseAPIException):
    """Error de autorización"""
    
    def __init__(self, detail: str = "No tienes permisos para realizar esta acción"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="AUTHORIZATION_ERROR"
        )


class BusinessLogicError(BaseAPIException):
    """Error de lógica de negocio"""
    
    def __init__(self, detail: str, error_code: str = "BUSINESS_LOGIC_ERROR"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code=error_code
        )


class ConflictError(BaseAPIException):
    """Error de conflicto (recurso ya existe)"""
    
    def __init__(self, detail: str, error_code: str = "CONFLICT"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
            error_code=error_code
        )


class DatabaseError(BaseAPIException):
    """Error de base de datos"""
    
    def __init__(self, detail: str = "Error en la base de datos"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
            error_code="DATABASE_ERROR"
        )


class ExternalServiceError(BaseAPIException):
    """Error en servicio externo"""
    
    def __init__(self, service: str, detail: str = "Error al conectar con servicio externo"):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"{service}: {detail}",
            error_code="EXTERNAL_SERVICE_ERROR",
            extra_data={"service": service}
        )

