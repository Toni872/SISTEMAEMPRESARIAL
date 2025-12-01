from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings
import urllib.parse

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
            # Reconstruir la URL con la contraseña codificada
            safe_url = urllib.parse.urlunparse((
                parsed.scheme,
                f"{parsed.username}:{encoded_password}@{parsed.hostname}:{parsed.port}",
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
db_url = get_database_url()
connect_args = {}

# Solo agregar connect_timeout y options para PostgreSQL, no para SQLite
if db_url.startswith("postgresql"):
    connect_args = {
        "connect_timeout": 10,  # Timeout de 10 segundos
        "options": "-c statement_timeout=30000"  # Timeout de queries de 30 segundos
    }
elif db_url.startswith("sqlite"):
    # SQLite solo necesita check_same_thread=False para tests
    connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    pool_pre_ping=True,
    pool_recycle=300,  # Reciclar conexiones cada 5 minutos
    connect_args=connect_args,
    echo=False  # No mostrar queries SQL en logs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
