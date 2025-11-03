# 🐳 Alternativa: Ejecutar SIN Docker

Si prefieres **no usar Docker**, puedes ejecutar el proyecto directamente con las herramientas nativas.

## ⚠️ Requisitos Previos (sin Docker)

Deberás instalar manualmente:
- **Node.js** (v18+)
- **PostgreSQL** (v14+)
- **Redis** (opcional para cache)
- **npm** o **yarn**

## 📝 Pasos para Ejecutar sin Docker

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Toni872/SISTEMAEMPRESARIAL.git
cd SISTEMAEMPRESARIAL
```

### 2. Instalar PostgreSQL
- **Windows**: Descargar de https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

Crear la base de datos:
```sql
CREATE DATABASE erp_db;
CREATE USER postgres WITH PASSWORD 'erp_password';
GRANT ALL PRIVILEGES ON DATABASE erp_db TO postgres;
```

### 3. Instalar Redis (Opcional)
- **Windows**: Descargar de https://redis.io/download
- **Mac**: `brew install redis`
- **Linux**: `sudo apt-get install redis`

### 4. Configurar Backend
```bash
cd backend
npm install

# Crear archivo .env
# Copiar backend/.env.example a backend/.env
# Y configurar:
DATABASE_URL="postgresql://postgres:erp_password@localhost:5432/erp_db"
REDIS_URL="redis://localhost:6379"

# Ejecutar migraciones
npx prisma migrate dev

# Poblar datos iniciales
npx prisma db seed

# Iniciar backend
npm run start:dev
```
El backend estará en: **http://localhost:3001**

### 5. Configurar Frontend
```bash
cd ../frontend
npm install

# Crear archivo .env
# Configurar:
VITE_GRAPHQL_URL=http://localhost:3001/graphql

# Iniciar frontend
npm run dev
```
El frontend estará en: **http://localhost:5173**

---

## 🆚 Docker vs Sin Docker

| Aspecto | Con Docker | Sin Docker |
|---------|-----------|------------|
| **Instalación** | ✅ 1 comando | ❌ 4-5 programas |
| **Configuración** | ✅ Automática | ❌ Manual |
| **Tiempo setup** | ⏱️ 5 minutos | ⏱️ 30+ minutos |
| **Portabilidad** | ✅ Idéntico en todos lados | ❌ Depende del SO |
| **Aislamiento** | ✅ Contenedores aislados | ❌ Puede conflictir |
| **Orden de servicios** | ✅ Automático | ❌ Debes iniciar todo |

## 💡 Recomendación

**Usa Docker** porque:
- Tu compañero solo necesita: Docker Desktop
- Instalación en 1 comando: `docker-compose up -d`
- **NO tiene que instalar PostgreSQL, Redis ni configurar nada**
- Los servicios se inician en el orden correcto automáticamente
- Tú y él veréis **exactamente** el mismo resultado

## 🚀 Comando Docker (Recomendado)

```bash
git clone https://github.com/Toni872/SISTEMAEMPRESARIAL.git
cd SISTEMAEMPRESARIAL
docker-compose up -d
```

¡Y listo! Todo funcionando en 2 minutos.

---

**Nota**: Si tu compañero es programador avanzado y prefiere instalar todo manualmente, puede usar la guía "Sin Docker" arriba.










