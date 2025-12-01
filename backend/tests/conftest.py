"""
Configuración global para tests
"""
import os
import tempfile
import pytest
from unittest.mock import patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Crear archivo temporal para SQLite ANTES de importar la app
temp_db = tempfile.NamedTemporaryFile(delete=False, suffix='.db')
temp_db.close()
TEST_DB_URL = f"sqlite:///{temp_db.name}"

# Configurar variables de entorno para tests ANTES de importar la app
# Usar SQLite para tests (más rápido y no requiere PostgreSQL)
os.environ["DATABASE_URL"] = TEST_DB_URL
os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"
os.environ["ENV"] = "test"
os.environ["RATE_LIMIT_ENABLED"] = "false"  # Deshabilitar rate limiting en tests
os.environ["RATE_LIMIT_ENABLED"] = "false"  # Deshabilitar rate limiting en tests

# Mock get_remote_address para tests antes de importar la app
def mock_get_remote_address(request):
    """Mock de get_remote_address para tests"""
    return "127.0.0.1"

# Aplicar el mock antes de importar módulos que usen slowapi
with patch('slowapi.util.get_remote_address', side_effect=mock_get_remote_address):
    from app.core.database import Base
    from app.api.auth.deps import get_db_session

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
    import time
    if os.path.exists(temp_db.name):
        # En Windows, puede haber un delay antes de que el archivo se libere
        # Intentar varias veces con delay
        for _ in range(5):
            try:
                os.unlink(temp_db.name)
                break
            except (PermissionError, OSError):
                time.sleep(0.1)
        else:
            # Si no se puede eliminar, intentar al menos cerrar conexiones
            try:
                engine.dispose()
            except:
                pass

