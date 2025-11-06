# Frontend ERP - React + Vite + TypeScript

Este frontend corresponde al sistema ERP Empresarial, desarrollado en React, TypeScript y Vite.

## Comandos básicos

```bash
# Instalar dependencias
npm install
# Lanzar en desarrollo
npm run dev

# Para producción (recomendado con Docker):
docker build -t erp-frontend .
docker run -p 5173:5173 erp-frontend
```

## Variables de entorno

Crea un archivo `.env` basado en `.env.example` (proporciónalo si no existe):

```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## Lanzamiento con Docker (recomendado)

```bash
docker-compose up -d
```

Esto lanzará frontend, backend y todos los servicios requeridos para un entorno homogéneo.

## Conectar con Backend

Asegúrate que el valor `VITE_API_URL` y `VITE_WS_URL` apunten al backend correspondiente según despliegues local o remoto.

## Buenas prácticas

- Nunca subas `.env`, solo `.env.example`.
- Discrimina entorno dev/prod via `VITE_API_URL`.
- Usa PR y revisiones para nuevas features.
- Realiza tests antes de mergear ramas.

## Troubleshooting

- ¿No ves datos? Verifica que backend esté corriendo y las URLs de API sean correctas.
- ¿El build arroja errores? Ejecuta `npm install` y revisa configuración de paths y alias.
