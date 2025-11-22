# Tests Unitarios - ERP Backend

## Estructura de Tests

Los tests están organizados por módulo:

- `test_auth.py` - Tests de autenticación
- `test_products.py` - Tests de productos (CRUD + API)
- `test_sales.py` - Tests de ventas (CRUD + API)
- `test_purchases.py` - Tests de compras (CRUD + API)

## Ejecutar Tests

### Requisitos

```bash
pip install pytest pytest-asyncio httpx
```

### Ejecutar todos los tests

```bash
cd backend
pytest tests/ -v
```

### Ejecutar tests específicos

```bash
# Solo tests de productos
pytest tests/test_products.py -v

# Solo tests de ventas
pytest tests/test_sales.py -v

# Solo tests de compras
pytest tests/test_purchases.py -v
```

### Con cobertura

```bash
pytest tests/ -v --cov=app --cov-report=html
```

## Configuración

Los tests usan SQLite en memoria para mayor velocidad. La configuración está en `conftest.py`:

- Base de datos temporal SQLite
- Tablas creadas automáticamente antes de cada test
- Limpieza automática después de cada test
- Override de dependencias de FastAPI para usar la BD de prueba

## Fixtures

- `db_session`: Sesión de base de datos para cada test

## Notas

- Los tests de API usan `AsyncClient` con `ASGITransport` para probar endpoints reales
- Los tests CRUD prueban directamente las funciones de negocio
- Todos los tests son independientes y pueden ejecutarse en cualquier orden

