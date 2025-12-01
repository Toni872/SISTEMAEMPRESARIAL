# 🚂 Configuración Railway - Resumen Rápido

## ✅ Cambios Realizados

### Archivos Eliminados
- ❌ `frontend-next/vercel.json`
- ❌ `frontend-next/seenode.json`
- ❌ `frontend-next/server.js`
- ❌ `DEPLOY_SEENODE.md`
- ❌ Todos los archivos `*VERCEL*.md`

### Archivos Creados/Actualizados
- ✅ `railway.json` - Configuración general
- ✅ `frontend-next/railway.json` - Configuración frontend
- ✅ `backend/Dockerfile` - Actualizado para usar `$PORT`
- ✅ `backend/start.sh` - Script de inicio alternativo
- ✅ `DEPLOY_RAILWAY.md` - Guía completa de deployment
- ✅ `frontend-next/package.json` - Revertido a `next start` estándar

## 🚀 Próximos Pasos

1. **Crear cuenta en Railway**: https://railway.app
2. **Conectar repositorio**: `Toni872/SISTEMAEMPRESARIAL`
3. **Railway detectará automáticamente**:
   - Backend (FastAPI) en `backend/`
   - Frontend (Next.js) en `frontend-next/`
4. **Añadir servicios**:
   - PostgreSQL (Database)
   - Redis (Database)
5. **Configurar variables de entorno** (ver `DEPLOY_RAILWAY.md`)

## 📖 Documentación Completa

Consulta `DEPLOY_RAILWAY.md` para la guía detallada paso a paso.

## 🔧 Configuración Técnica

### Backend
- **Puerto**: Usa `$PORT` automáticamente (Railway lo inyecta)
- **Comando**: `uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}`
- **Dockerfile**: Actualizado para usar variable PORT

### Frontend
- **Puerto**: Next.js usa `$PORT` automáticamente
- **Comando**: `npm start` (Next.js maneja PORT internamente)
- **Build**: `npm run build`

## ✨ Ventajas de Railway

- ✅ Todo en una plataforma (Frontend + Backend + DBs)
- ✅ Detección automática de frameworks
- ✅ Variables de entorno gestionadas fácilmente
- ✅ Plan gratuito generoso
- ✅ Deploy automático desde GitHub




