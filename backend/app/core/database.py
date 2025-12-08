from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings
import urllib.parse
import os

# Codificar correctamente la URL de la base de datos para evitar problemas de encoding
def get_database_url():
    """Obtiene la URL de la base de datos con encoding correcto"""
    db_url = str(settings.DATABASE_URL)
    try:
        # Parsear la URL
        parsed = urllib.parse.urlparse(db_url)
        # Codificar correctamente la contraseña si existe
        if parsed.password:
            # Reconstruir con password codificado
            encoded_password = urllib.parse.quote(parsed.password, safe='')
            # Construir netloc con o sin puerto
            if parsed.port:
                netloc = f"{parsed.username}:{encoded_password}@{parsed.hostname}:{parsed.port}"
            else:
                netloc = f"{parsed.username}:{encoded_password}@{parsed.hostname}"
            # Reconstruir la URL con la contraseña codificada
            safe_url = urllib.parse.urlunparse((
                parsed.scheme,
                netloc,
                parsed.path,
                parsed.params,
                parsed.query,
                parsed.fragment
            ))
            return safe_url
        return db_url
    except Exception:
        # Si hay error, retornar la URL original
        return db_url

# Crear engine con timeout para evitar cuelgues
# Validar que DATABASE_URL esté configurada
try:
    db_url = get_database_url()
    if not db_url:
        raise ValueError("DATABASE_URL no está configurada")
except Exception as e:
    # Fallback: intentar obtener desde os.environ directamente
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise ValueError(f"DATABASE_URL no está configurada: {e}")

connect_args = {}

# Solo agregar connect_timeout y options para PostgreSQL, no para SQLite
if db_url.startswith("postgresql"):
    connect_args = {
        "connect_timeout": 10,  # Timeout de 10 segundos
    }
    # Neon.tech no soporta statement_timeout en conexiones pooled
    # Solo agregar si no es una conexión pooled de Neon
    if "-pooler" not in db_url:
        connect_args["options"] = "-c statement_timeout=30000"  # Timeout de queries de 30 segundos
elif db_url.startswith("sqlite"):
    # SQLite solo necesita check_same_thread=False para tests
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=300,  # Reciclar conexiones cada 5 minutos
        connect_args=connect_args,
        echo=False  # No mostrar queries SQL en logs
    )
except Exception as e:
    import sys
    print(f"❌ Error al crear engine de base de datos: {e}", file=sys.stderr)
    print(f"   DATABASE_URL: {db_url[:50]}..." if len(db_url) > 50 else f"   DATABASE_URL: {db_url}", file=sys.stderr)
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Obtener sesión de base de datos con manejo de errores"""
    db = None
    try:
        db = SessionLocal()
        yield db
    except Exception as e:
        import sys
        print(f"❌ Error al obtener sesión de base de datos: {e}", file=sys.stderr)
        if db:
            db.rollback()
        raise
    finally:
        if db:
            db.close()
