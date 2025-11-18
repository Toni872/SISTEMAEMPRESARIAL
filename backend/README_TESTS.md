# Guía de Testing

## Ejecutar Tests

### Opción 1: Con Docker (Recomendado)
```bash
# Asegúrate de que Docker esté corriendo
docker-compose up -d

# Ejecutar todos los tests
docker-compose exec web pytest tests/ -v

# Ejecutar un test específico
docker-compose exec web pytest tests/test_auth.py::test_register_and_login -v

# Ejecutar con cobertura
docker-compose exec web pytest tests/ --cov=app --cov-report=term
```

### Opción 2: Localmente (sin Docker)
```bash
# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (opcional, ya están en conftest.py)
export DATABASE_URL="sqlite:///:memory:"
export SECRET_KEY="test-secret-key"
export ENV="test"

# Ejecutar tests
pytest tests/ -v
```

### Opción 3: Con Makefile
```bash
make test        # Ejecutar tests
make test-cov    # Tests con cobertura
```

## Estructura de Tests

- `tests/conftest.py` - Configuración global de pytest
- `tests/test_auth.py` - Tests de autenticación

## Tests Incluidos

1. **test_register_and_login** - Verifica registro y login exitosos
2. **test_register_duplicate_email** - Verifica que no se puedan registrar emails duplicados
3. **test_login_invalid_credentials** - Verifica validación de credenciales incorrectas

## Agregar Nuevos Tests

1. Crea un nuevo archivo `tests/test_*.py`
2. Importa `pytest` y `AsyncClient`
3. Usa la fixture `db_session` para tener una BD limpia por test
4. Ejemplo:

```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_mi_nuevo_test(db_session):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/mi-endpoint")
        assert response.status_code == 200
```

