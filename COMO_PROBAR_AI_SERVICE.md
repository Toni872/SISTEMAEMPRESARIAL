# 🧪 Cómo Probar el AI Service

## ✅ Estado Actual

El sistema ERP está funcionando con:
- ✅ Backend NestJS en puerto 3001
- ✅ Frontend React en puerto 5173
- ✅ PostgreSQL en puerto 5432
- ✅ Redis en puerto 6379

**AI Service** está implementado pero necesita Docker con conexión a Internet para descargar la imagen de Python.

---

## 🚀 Opción 1: Probar con Docker (Requiere Internet)

### 1. Verificar que tengas conexión a Internet

### 2. Construir y ejecutar el AI Service:
```bash
# Reconstruir el servicio
docker-compose up -d --build ai-service

# Ver logs
docker-compose logs -f ai-service
```

### 3. Probar los endpoints:

#### Health Check
```bash
curl http://localhost:8000/health
```

#### Predecir Demanda
```bash
curl -X POST http://localhost:8000/api/predict/demand \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "days": 30}'
```

Respuesta esperada:
```json
{
  "product_id": 1,
  "predicted_units": 150,
  "days": 30,
  "confidence": 0.85,
  "recommendations": [
    "Aumentar stock en 15%",
    "Promoción recomendada en los próximos 7 días"
  ],
  "model_version": "v1.0"
}
```

#### Optimizar Precio
```bash
curl -X POST http://localhost:8000/api/optimize/price \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "current_price": 299.99, "stock": 50}'
```

#### Modelos Activos
```bash
curl http://localhost:8000/api/models/active
```

---

## 🖥️ Opción 2: Probar Localmente (Sin Docker)

### 1. Instalar dependencias:
```bash
cd ai_service
pip install -r requirements.txt
```

### 2. Ejecutar el servidor:
```bash
python -m uvicorn app.main:app --reload --port 8000
```

### 3. Probar con los mismos comandos curl de arriba

---

## 🌐 Opción 3: Probar desde el Frontend (GraphQL)

### 1. Abrir el frontend en el navegador:
```
http://localhost:5173
```

### 2. Ir a GraphQL Playground:
```
http://localhost:3001/graphql
```

### 3. Ejecutar queries:

#### Obtener Modelos Activos
```graphql
query {
  activeAIModels {
    total_models
    operational
    training
    maintenance
  }
}
```

#### Predecir Demanda
```graphql
query {
  predictDemand(productId: 1, days: 30) {
    predictedUnits
    confidence
    recommendations
  }
}
```

#### Optimizar Precio
```graphql
query {
  optimizePrice(
    productId: 1
    currentPrice: 299.99
    stock: 50
  ) {
    optimalPrice
    priceChangePercentage
    expectedRevenueIncrease
    recommendation
  }
}
```

---

## 📊 Verificar que todo funciona

### 1. Verificar servicios Docker:
```bash
docker-compose ps
```

Deberías ver:
```
NAME                  STATUS
erp-backend-dev       Up
erp-frontend-dev      Up
erp-postgres-dev      Up (healthy)
erp-redis-dev         Up (healthy)
erp-ai-service        Up (healthy)  ← NUEVO
```

### 2. Ver logs del AI Service:
```bash
docker-compose logs ai-service
```

### 3. Test desde navegador:
```
http://localhost:8000
```

Deberías ver:
```json
{
  "message": "AI Service - ERP System",
  "endpoints": {
    "health": "/health",
    "predict_demand": "/api/predict/demand",
    "optimize_price": "/api/optimize/price",
    "get_active_models": "/api/models/active"
  }
}
```

---

## 🐛 Solución de Problemas

### Problema: AI Service no inicia
```bash
# Ver logs detallados
docker-compose logs ai-service

# Reconstruir sin cache
docker-compose build --no-cache ai-service
docker-compose up -d ai-service
```

### Problema: Error de conexión desde NestJS
Verificar que la variable de entorno esté configurada:
```env
AI_SERVICE_URL=http://ai-service:8000
```

En `backend/.env`

### Problema: Puerto 8000 ocupado
Cambiar el puerto en `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Puerto alternativo
```

Y actualizar `AI_SERVICE_URL` en backend.

---

## ✅ Checklist de Pruebas

- [ ] AI Service inicia correctamente
- [ ] Health check responde
- [ ] Endpoint de predicción funciona
- [ ] Endpoint de optimización funciona
- [ ] Modelos activos se muestran
- [ ] GraphQL queries funcionan desde NestJS
- [ ] Dashboard puede mostrar métricas de IA

---

## 🎯 Próximos Pasos

Una vez que el AI Service funcione:

1. **Fase 2**: Implementar modelos ML reales con scikit-learn
2. **Integrar con dashboard**: Mostrar predicciones en el frontend
3. **Fase 3**: Crear Analytics Service
4. **Fase 4**: Crear Logistics Service

---

## 📝 Notas

- Los modelos actualmente retornan datos **mockeados**
- Para modelos reales, necesitamos entrenar con datos históricos
- El servicio está listo para escalar con más modelos ML
- Todos los endpoints tienen manejo de errores y logging

**¡Listo para probar!** 🚀










