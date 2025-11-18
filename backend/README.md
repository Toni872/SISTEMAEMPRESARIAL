# ERP Sistema Backend

Backend API desarrollado con FastAPI para el sistema ERP empresarial.

## Características

- **FastAPI**: Framework web moderno y rápido
- **PostgreSQL**: Base de datos relacional
- **SQLAlchemy**: ORM para Python
- **Alembic**: Migraciones de base de datos
- **JWT**: Autenticación con tokens
- **Pydantic**: Validación de datos

## Estructura del Proyecto

```
backend/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── endpoints.py   # Rutas de autenticación
│   │   │   ├── deps.py        # Dependencias (auth, db)
│   │   │   └── schemas.py     # Pydantic schemas
│   │   └── __init__.py
│   ├── core/
│   │   ├── config.py          # Variables de entorno
│   │   ├── security.py        # JWT, password hashing
│   │   ├── database.py        # Engine, session
│   │   └── utils.py           # Helpers
│   ├── crud/
│   │   └── user.py            # Lógica de acceso a DB
│   ├── models/
│   │   └── user.py            # SQLAlchemy modelos
│   ├── main.py                # Creación de app FastAPI
│   └── __init__.py
├── alembic/                   # Migraciones
├── migrations/                 # Archivos de migración generados
├── scripts/                   # Seed, backup, etc.
├── .env                       # Variables de entorno
├── .env.example
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── pytest.ini
```

## Instalación

### Requisitos Previos

- Python 3.11+
- PostgreSQL 15+
- pip

### Configuración Local

1. **Clonar y entrar al directorio:**
   ```bash
   cd backend
   ```

2. **Crear entorno virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

5. **Ejecutar migraciones:**
   ```bash
   alembic upgrade head
   ```

6. **Iniciar servidor:**
   ```bash
   uvicorn app.main:app --reload
   ```

## Docker

### Desarrollo con Docker Compose

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en el puerto 5432
- Backend API en el puerto 8000

### Construir imagen Docker

```bash
docker build -t erp-backend .
```

## Endpoints

### Autenticación

- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/me` - Obtener usuario actual

### Documentación

- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc

## Migraciones

### Crear nueva migración

```bash
alembic revision --autogenerate -m "descripción"
```

### Aplicar migraciones

```bash
alembic upgrade head
```

### Revertir migración

```bash
alembic downgrade -1
```

## Testing

```bash
pytest
```

## Variables de Entorno

Ver `.env.example` para todas las variables disponibles.

Las principales son:
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `SECRET_KEY`: Clave secreta para JWT (mínimo 32 caracteres)
- `DEBUG`: Modo debug (True/False)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Tiempo de expiración del token

## Desarrollo

El servidor se ejecuta en modo desarrollo con recarga automática:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

