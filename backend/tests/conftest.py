"""
Configuración global para tests
"""
import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Configurar variables de entorno para tests ANTES de importar la app
# Usar una URL de PostgreSQL válida pero que será sobrescrita en el engine
os.environ["DATABASE_URL"] = "postgresql://test:test@localhost/test"
os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"
os.environ["ENV"] = "test"

from app.core.database import Base
from app.api.auth.deps import get_db_session

# Base de datos de prueba - usar archivo temporal para que todas las conexiones compartan la misma BD
import tempfile
import os

# Crear archivo temporal para SQLite
temp_db = tempfile.NamedTemporaryFile(delete=False, suffix='.db')
temp_db.close()
TEST_DB_URL = f"sqlite:///{temp_db.name}"

engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear tablas una vez al inicio
Base.metadata.create_all(bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Fixture que crea una nueva sesión de BD para cada test"""
    # Asegurar que las tablas existan
    Base.metadata.create_all(bind=engine)
    
    # Crear sesión
    db = TestingSessionLocal()
    
    def override_get_db_session():
        try:
            yield db
        finally:
            pass  # No cerrar aquí, se cierra al final del fixture
    
    # Override la dependencia
    from app.main import app
    app.dependency_overrides[get_db_session] = override_get_db_session
    
    try:
        yield db
    finally:
        # Limpiar después del test
        db.rollback()
        db.close()
        Base.metadata.drop_all(bind=engine)
        app.dependency_overrides.clear()
        
        # Recrear tablas para el siguiente test
        Base.metadata.create_all(bind=engine)


def pytest_sessionfinish(session, exitstatus):
    """Limpiar archivo temporal al finalizar todos los tests"""
    if os.path.exists(temp_db.name):
        os.unlink(temp_db.name)

