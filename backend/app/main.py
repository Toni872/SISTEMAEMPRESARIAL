from fastapi import FastAPI, Request, status as http_status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time
import uuid
import traceback
from .api.auth import endpoints as auth_endpoints
from .core.config import settings
from .core.logging_config import setup_logging, get_logger
from .core.exceptions import BaseAPIException
from .api.products import endpoints as products_endpoints
from .api.sales import endpoints as sales_endpoints
from .api.dashboard import endpoints as dashboard_endpoints
from .api.recurring_invoices import endpoints as recurring_invoices_endpoints
from .api.invoice_templates import endpoints as invoice_templates_endpoints
from .api.tax import endpoints as tax_endpoints
from .api.verifactu import endpoints as verifactu_endpoints
from .api.verifactu import certificates as verifactu_certificates
from .api.verifactu import aeat_integration as verifactu_aeat
from .api.purchases import endpoints as purchases_endpoints
from .core.rate_limit import limiter

# Configurar logging
setup_logging(env=settings.ENV)
logger = get_logger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
    ## Sistema Empresarial - API Backend
    
    API REST completa para gestión empresarial con:
    
    - 🔐 **Autenticación y Autorización**: Sistema de usuarios con JWT
    - 📦 **Productos**: Gestión de catálogo de productos
    - 💰 **Ventas**: Sistema completo de facturación y ventas
    - 📋 **Compras**: Gestión de compras y proveedores
    - 🔄 **Facturas Recurrentes**: Automatización de facturación
    - 📄 **Plantillas**: Plantillas personalizables de facturas
    - 📊 **Modelos Fiscales**: Modelo 303 (IVA) y Modelo 111 (IRPF)
    - ✅ **Verifactu**: Integración con AEAT para facturación electrónica
    - 📈 **Dashboard**: Estadísticas y métricas del negocio
    
    ### Autenticación
    
    La mayoría de los endpoints requieren autenticación mediante Bearer Token.
    Obtén tu token en `/api/auth/login` y úsalo en el header:
    ```
    Authorization: Bearer <tu_token>
    ```
    
    ### Códigos de Error
    
    - `NOT_FOUND`: Recurso no encontrado (404)
    - `VALIDATION_ERROR`: Error de validación (422)
    - `AUTHENTICATION_ERROR`: Error de autenticación (401)
    - `AUTHORIZATION_ERROR`: Error de autorización (403)
    - `BUSINESS_LOGIC_ERROR`: Error de lógica de negocio (400)
    - `CONFLICT`: Conflicto, recurso ya existe (409)
    """,
    version=settings.VERSION,
    contact={
        "name": "Sistema Empresarial",
        "email": "support@sistemaempresarial.com",
    },
    license_info={
        "name": "MIT",
    },
)

# Middleware para agregar request ID
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Agrega un ID único a cada request para tracking"""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Headers de seguridad básicos
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    
    # Content Security Policy (CSP)
    # Permitir solo recursos de origen propio y APIs necesarias
    csp_policy = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "  # unsafe-inline/eval para Swagger UI
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: https:; "
        "connect-src 'self' https://api.github.com; "  # Para GitHub Actions badges si aplica
        "frame-ancestors 'none'; "
        "base-uri 'self'; "
        "form-action 'self'; "
        "object-src 'none'; "
        "upgrade-insecure-requests"
    )
    response.headers["Content-Security-Policy"] = csp_policy
    
    # Strict Transport Security (solo en producción)
    if settings.ENV == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
    
    return response

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware para logging de requests"""
    start_time = time.time()
    request_id = getattr(request.state, "request_id", "unknown")
    
    # Log de request entrante
    logger.info(
        f"{request.method} {request.url.path}",
        extra={
            "request_id": request_id,
            "method": request.method,
            "endpoint": request.url.path,
            "client_ip": request.client.host if request.client else None,
        }
    )
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        # Log de response
        logger.info(
            f"{request.method} {request.url.path} - {response.status_code}",
            extra={
                "request_id": request_id,
                "method": request.method,
                "endpoint": request.url.path,
                "status_code": response.status_code,
                "process_time": process_time,
            }
        )
        
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"Error en {request.method} {request.url.path}",
            extra={
                "request_id": request_id,
                "method": request.method,
                "endpoint": request.url.path,
                "error": str(e),
                "traceback": traceback.format_exc(),
                "process_time": process_time,
            },
            exc_info=True
        )
        raise

# CORS middleware - Configuración más segura
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    expose_headers=["X-Total-Count", "X-Page-Count"],
    max_age=3600,
)

# Include routers
app.include_router(auth_endpoints.router)
app.include_router(products_endpoints.router)
app.include_router(sales_endpoints.router)
app.include_router(dashboard_endpoints.router)
app.include_router(recurring_invoices_endpoints.router)
app.include_router(invoice_templates_endpoints.router)
app.include_router(tax_endpoints.router)
app.include_router(verifactu_endpoints.router)
app.include_router(verifactu_certificates.router)
app.include_router(verifactu_aeat.router)
app.include_router(purchases_endpoints.router)


@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": settings.VERSION,
        "status": "running"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# Manejo global de excepciones
@app.exception_handler(BaseAPIException)
async def api_exception_handler(request: Request, exc: BaseAPIException):
    """Maneja excepciones personalizadas de la API"""
    request_id = getattr(request.state, "request_id", "unknown")
    
    logger.warning(
        f"API Exception: {exc.detail}",
        extra={
            "request_id": request_id,
            "error_code": exc.error_code,
            "status_code": exc.status_code,
            "endpoint": request.url.path,
            "method": request.method,
            "extra_data": exc.extra_data,
        }
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "error_code": exc.error_code,
            "detail": exc.detail,
            "request_id": request_id,
            **exc.extra_data
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Maneja errores de validación de Pydantic"""
    request_id = getattr(request.state, "request_id", "unknown")
    
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    logger.warning(
        f"Validation Error: {exc.errors()}",
        extra={
            "request_id": request_id,
            "endpoint": request.url.path,
            "method": request.method,
            "errors": errors,
        }
    )
    
    return JSONResponse(
        status_code=http_status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "error_code": "VALIDATION_ERROR",
            "detail": "Error de validación en los datos enviados",
            "request_id": request_id,
            "errors": errors
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Maneja excepciones no controladas"""
    request_id = getattr(request.state, "request_id", "unknown")
    
    logger.error(
        f"Unhandled Exception: {str(exc)}",
        extra={
            "request_id": request_id,
            "endpoint": request.url.path,
            "method": request.method,
            "exception_type": type(exc).__name__,
            "traceback": traceback.format_exc(),
        },
        exc_info=True
    )
    
    # En producción, no exponer detalles del error
    if settings.ENV == "production":
        detail = "Error interno del servidor"
    else:
        detail = f"Error interno: {str(exc)}"
    
    return JSONResponse(
        status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "error_code": "INTERNAL_SERVER_ERROR",
            "detail": detail,
            "request_id": request_id,
        }
    )
