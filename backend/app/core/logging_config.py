"""
Configuración de logging estructurado para la aplicación
"""
import logging
import sys
from pathlib import Path
from datetime import datetime
from typing import Any, Dict
import json

# Crear directorio de logs si no existe (solo si no estamos en Vercel/serverless)
LOG_DIR = Path("logs")
# En Vercel/serverless, el sistema de archivos es de solo lectura
# Intentar crear el directorio y capturar el error si falla
try:
    LOG_DIR.mkdir(exist_ok=True)
except (OSError, PermissionError):
    # Estamos en un entorno serverless (Vercel), no crear directorio
    LOG_DIR = None


class JSONFormatter(logging.Formatter):
    """Formatter que convierte logs a JSON estructurado"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Agregar información adicional si existe
        if hasattr(record, "user_id"):
            log_data["user_id"] = record.user_id
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        if hasattr(record, "endpoint"):
            log_data["endpoint"] = record.endpoint
        if hasattr(record, "method"):
            log_data["method"] = record.method
        
        # Agregar excepción si existe
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        # Agregar campos extra (sanitizados)
        if hasattr(record, "extra_data"):
            from .security_utils import sanitize_dict_for_logging
            sanitized_extra = sanitize_dict_for_logging(record.extra_data)
            log_data.update(sanitized_extra)
        
        return json.dumps(log_data, ensure_ascii=False)


class ColoredFormatter(logging.Formatter):
    """Formatter con colores para desarrollo"""
    
    COLORS = {
        'DEBUG': '\033[36m',      # Cyan
        'INFO': '\033[32m',       # Green
        'WARNING': '\033[33m',    # Yellow
        'ERROR': '\033[31m',      # Red
        'CRITICAL': '\033[35m',   # Magenta
    }
    RESET = '\033[0m'
    
    def format(self, record: logging.LogRecord) -> str:
        log_color = self.COLORS.get(record.levelname, self.RESET)
        record.levelname = f"{log_color}{record.levelname}{self.RESET}"
        return super().format(record)


def setup_logging(env: str = "development"):
    """
    Configura el sistema de logging según el entorno
    
    Args:
        env: Entorno ('development', 'production', 'test')
    """
    # Configurar nivel según entorno
    if env == "production":
        level = logging.INFO
    elif env == "test":
        level = logging.WARNING
    else:  # development
        level = logging.DEBUG
    
    # Crear logger raíz
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    
    # Limpiar handlers existentes
    root_logger.handlers.clear()
    
    # Handler para consola
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    
    if env == "production":
        # En producción, usar JSON
        console_handler.setFormatter(JSONFormatter())
    else:
        # En desarrollo, usar formato legible con colores
        console_format = logging.Formatter(
            '%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        console_handler.setFormatter(ColoredFormatter(
            '%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        ))
    
    root_logger.addHandler(console_handler)
    
    # Handler para archivo (solo en producción y si no estamos en serverless)
    # En Vercel/serverless, el sistema de archivos es de solo lectura
    if env == "production" and LOG_DIR is not None:
        try:
            file_handler = logging.FileHandler(
                LOG_DIR / f"app_{datetime.now().strftime('%Y%m%d')}.log",
                encoding='utf-8'
            )
            file_handler.setLevel(logging.INFO)
            file_handler.setFormatter(JSONFormatter())
            root_logger.addHandler(file_handler)
            
            # Handler para errores críticos
            error_handler = logging.FileHandler(
                LOG_DIR / f"errors_{datetime.now().strftime('%Y%m%d')}.log",
                encoding='utf-8'
            )
            error_handler.setLevel(logging.ERROR)
            error_handler.setFormatter(JSONFormatter())
            root_logger.addHandler(error_handler)
        except (OSError, PermissionError):
            # No podemos escribir archivos en este entorno (serverless)
            # Usar solo logging a stdout/stderr (que Vercel captura automáticamente)
            pass
    
    # Configurar loggers de terceros
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.pool").setLevel(logging.WARNING)
    
    return root_logger


def get_logger(name: str) -> logging.Logger:
    """Obtiene un logger con el nombre especificado"""
    return logging.getLogger(name)

