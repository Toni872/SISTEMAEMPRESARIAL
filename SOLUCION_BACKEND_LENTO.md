# 🔧 Solución: Backend Tardando en Iniciar

## Problemas Encontrados y Solucionados

### 1. ❌ Puerto Incorrecto
**Problema:** El `.env` tenía el puerto `5432` pero PostgreSQL está corriendo en `5433`

**Solución:** ✅ Corregido automáticamente a `5433`

### 2. ❌ Error de Encoding UTF-8
**Problema:** Error al decodificar la contraseña de la base de datos
```
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xf3 in position 85
```

**Solución:** ✅ Agregado encoding seguro de la contraseña en `database.py`

### 3. ❌ Sin Timeout en Conexiones
**Problema:** Las conexiones podían quedarse colgadas indefinidamente

**Solución:** ✅ Agregados timeouts:
- `connect_timeout`: 10 segundos
- `statement_timeout`: 30 segundos
- `pool_recycle`: 5 minutos

## Cambios Realizados

### `backend/app/core/database.py`
- ✅ Codificación segura de contraseñas en la URL
- ✅ Timeouts para evitar cuelgues
- ✅ Pool recycling para mantener conexiones saludables

### `backend/.env`
- ✅ Puerto corregido de `5432` a `5433`

## Cómo Iniciar el Backend Ahora

```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

O usando el Makefile:
```bash
cd backend
make run
```

## Verificación

El servidor debería iniciar en menos de 5 segundos. Verifica con:

```bash
# Health check
curl http://localhost:8000/health

# O en el navegador
http://localhost:8000/docs
```

## Si Aún Tarda

1. Verifica que PostgreSQL esté corriendo:
   ```bash
   docker ps | grep postgres
   ```

2. Verifica la conexión:
   ```bash
   cd backend
   python diagnostico_backend.py
   ```

3. Revisa los logs del backend para ver dónde se queda atascado

