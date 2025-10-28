-- Script SQL de inicialización para PostgreSQL
-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurar zona horaria
SET timezone = 'UTC';

-- Crear usuario de aplicación
CREATE USER erp_user WITH PASSWORD 'erp_password';
GRANT ALL PRIVILEGES ON DATABASE erp_db TO erp_user;

-- Crear índices adicionales para optimización
-- (Se ejecutarán después de las migraciones de Prisma)