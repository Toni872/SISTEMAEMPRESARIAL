from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.auth import endpoints as auth_endpoints
from .api.products import endpoints as products_endpoints
from .api.sales import endpoints as sales_endpoints
from .core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A FastAPI backend built with best practices",
    version=settings.VERSION,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_endpoints.router)
app.include_router(products_endpoints.router)
app.include_router(sales_endpoints.router)


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
