# 🚀 Cómo Iniciar el Backend

## Opción 1: Con uvicorn directamente (Recomendado para desarrollo)

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

O usando el Makefile:
```bash
cd backend
make run
```

## Opción 2: Con Docker

Si prefieres usar Docker, primero verifica que tengas un `docker-compose.yml` configurado.

## Verificación

Una vez iniciado, deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

Luego puedes verificar en el navegador:
- http://localhost:8000 - Health check
- http://localhost:8000/docs - Swagger UI
- http://localhost:8000/redoc - ReDoc

## Configuración de Base de Datos

Asegúrate de que en `backend/.env` tengas:

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5433/erp_db
```

**Nota:** El puerto es `5433` porque PostgreSQL está corriendo en Docker en ese puerto (no en el 5432 por defecto).

## Credenciales de Prueba

Si necesitas crear un usuario de prueba:

```bash
cd backend
python scripts/create_test_user.py
```

O resetear la contraseña:

```bash
python scripts/reset_test_user_password.py
```

Las credenciales por defecto son:
- Email: `test@example.com`
- Password: `testpassword123`













