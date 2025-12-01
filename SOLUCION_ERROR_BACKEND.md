# 🔧 Solución: Error de Conexión con Backend

**Error:** `No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8000`

---

## 🎯 Problema

El frontend no puede conectarse al backend porque el servidor backend no está corriendo en `http://localhost:8000`.

---

## ✅ Solución Rápida

### Opción 1: Usar Docker Compose (Recomendado)

```powershell
# Desde la raíz del proyecto
docker-compose -f docker-compose.backend.yml up -d
```

Esto iniciará:
- ✅ PostgreSQL en el puerto 5433
- ✅ Backend FastAPI en el puerto 8000

### Opción 2: Iniciar Backend Manualmente

#### Requisitos previos:
1. PostgreSQL corriendo (puerto 5432 o 5433)
2. Python 3.11+ instalado
3. Variables de entorno configuradas

#### Pasos:

1. **Navegar al directorio backend:**
```powershell
cd backend
```

2. **Crear entorno virtual (si no existe):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. **Instalar dependencias:**
```powershell
pip install -r requirements.txt
```

4. **Configurar variables de entorno:**
Crea un archivo `.env` en `backend/` con:
```env
DATABASE_URL=postgresql://postgres:erp_password@localhost:5432/erp_fastapi_db
SECRET_KEY=super-secret-key-change-in-production
ENV=development
```

5. **Iniciar el servidor:**
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🔍 Verificar que el Backend Está Corriendo

### 1. Verificar en el navegador:
Abre: http://localhost:8000/docs

Deberías ver la documentación interactiva de FastAPI (Swagger UI).

### 2. Verificar con curl:
```powershell
curl http://localhost:8000/api/health
```

O en PowerShell:
```powershell
Invoke-WebRequest -Uri http://localhost:8000/api/health
```

---

## 🐛 Troubleshooting

### Problema: Puerto 8000 ya está en uso

**Solución:**
```powershell
# Encontrar proceso usando el puerto 8000
netstat -ano | findstr :8000

# Matar el proceso (reemplaza PID con el número del proceso)
taskkill /PID <PID> /F
```

### Problema: PostgreSQL no está corriendo

**Solución:**
```powershell
# Iniciar PostgreSQL con Docker
docker-compose up -d postgres

# O iniciar PostgreSQL manualmente si está instalado localmente
```

### Problema: Error de conexión a la base de datos

**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `.env`
3. Verifica que la base de datos exista:
```sql
CREATE DATABASE erp_fastapi_db;
```

### Problema: Variables de entorno no se cargan

**Solución:**
- Asegúrate de que el archivo `.env` esté en `backend/`
- Verifica que las variables estén correctamente escritas (sin espacios alrededor del `=`)
- Reinicia el servidor después de cambiar `.env`

---

## 📝 Scripts Útiles

### Iniciar Backend con Docker Compose:
```powershell
# Iniciar backend y dependencias
docker-compose -f docker-compose.backend.yml up -d

# Ver logs
docker-compose -f docker-compose.backend.yml logs -f backend

# Detener
docker-compose -f docker-compose.backend.yml down
```

### Iniciar Backend Manualmente:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## ✅ Verificación Final

Una vez que el backend esté corriendo, deberías poder:

1. ✅ Acceder a http://localhost:8000/docs
2. ✅ Ver la documentación de la API
3. ✅ El frontend debería conectarse automáticamente
4. ✅ El error en la consola debería desaparecer

---

## 🚀 Próximos Pasos

1. Inicia el backend usando una de las opciones arriba
2. Verifica que esté corriendo accediendo a http://localhost:8000/docs
3. Recarga el frontend (F5)
4. El error debería desaparecer

---

**Nota:** Si el problema persiste después de iniciar el backend, verifica:
- Que el puerto 8000 no esté bloqueado por firewall
- Que no haya problemas de CORS (el backend debería tener CORS configurado)
- Que la URL en el frontend sea correcta (`NEXT_PUBLIC_API_URL`)



