# 🧪 Configuración para Tests E2E

## Problema de Concurrencia

Los tests E2E fallan cuando se ejecutan en paralelo debido a rate limiting en el endpoint de login (5 requests/minuto por IP).

## Solución Implementada

### 1. Deshabilitar Rate Limiting en Modo E2E

El backend ahora detecta el modo E2E mediante la variable de entorno `E2E_MODE=true` y deshabilita automáticamente el rate limiting.

### 2. Configurar Backend para E2E

**Opción A: Variable de entorno (Recomendada)**

```bash
# En docker-compose.backend.yml o al iniciar el backend
E2E_MODE=true
```

**Opción B: Modificar .env del backend**

```env
E2E_MODE=true
RATE_LIMIT_ENABLED=false  # También funciona
```

### 3. Configurar Playwright

Playwright está configurado para usar **3 workers** en desarrollo y **2 en CI**, lo que proporciona buen paralelismo sin exceder límites.

## Uso

### Ejecutar Tests E2E con Rate Limiting Deshabilitado

```bash
# 1. Iniciar backend con E2E_MODE
cd backend
E2E_MODE=true uvicorn app.main:app --reload

# O con Docker Compose
E2E_MODE=true docker-compose -f docker-compose.backend.yml up

# 2. Ejecutar tests E2E
cd frontend-next
npm run test:e2e
```

### Verificar que Rate Limiting está Deshabilitado

```bash
# Hacer múltiples requests de login rápidamente
for i in {1..10}; do
  curl -X POST http://localhost:8000/api/auth/login \
    -d "username=test@example.com&password=testpassword123"
done

# Si E2E_MODE=true, todos deberían pasar
# Si E2E_MODE=false, algunos fallarán con 429 (Too Many Requests)
```

## Notas

- ✅ Rate limiting sigue activo en producción (E2E_MODE=false por defecto)
- ✅ Tests unitarios ya tienen rate limiting deshabilitado
- ✅ Tests E2E ahora pueden ejecutarse en paralelo sin problemas






