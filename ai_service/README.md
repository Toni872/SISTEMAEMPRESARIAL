# AI Service - ERP System

Servicio de Inteligencia Artificial para análisis predictivo y optimización.

## Características

- **Predicción de Demanda**: Modelos ML para predecir demanda de productos
- **Optimización de Precios**: Algoritmos para optimizar precios dinámicamente
- **Análisis Predictivo**: Análisis avanzado de datos de negocio
- **Modelos Activos**: 32 modelos de IA en producción

## Endpoints

- `GET /health` - Health check
- `POST /api/predict/demand` - Predicción de demanda
- `POST /api/optimize/price` - Optimización de precios
- `GET /api/models/active` - Modelos activos
- `GET /api/models/stats` - Estadísticas de modelos

## Desarrollo Local

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn app.main:app --reload --port 8000
```

## Docker

```bash
# Build
docker build -t ai-service .

# Run
docker run -p 8000:8000 ai-service
```

## Integración con NestJS

El servicio se comunica con NestJS mediante HTTP REST.

```typescript
// Ejemplo en NestJS
const response = await httpService.post(
  'http://ai-service:8000/api/predict/demand',
  { product_id: 123, days: 30 }
);
```










