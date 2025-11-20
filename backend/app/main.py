from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time
from .api.auth import endpoints as auth_endpoints
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
from .core.config import settings
from .core.rate_limit import limiter

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A FastAPI backend built with best practices",
    version=settings.VERSION,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if settings.ENV == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

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
