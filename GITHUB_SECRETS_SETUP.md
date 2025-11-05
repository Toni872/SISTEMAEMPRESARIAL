# 🔐 Configuración de GitHub Secrets

Esta guía te ayudará a configurar todos los secretos necesarios para que los workflows de GitHub Actions funcionen correctamente.

---

## 📋 **Secrets Necesarios**

### 1. **SNYK_TOKEN** (Security Scanning) 🔴 CRÍTICO

**¿Para qué?** Escaneo automático de vulnerabilidades en dependencias

**¿Cómo obtenerlo?**
1. Regístrate en [Snyk.io](https://snyk.io)
2. Ve a **Account Settings** → **General**
3. Copia tu **Auth Token**
4. Pégalo en GitHub Secrets como `SNYK_TOKEN`

**Frecuencia:** Escaneo diario automático

---

### 2. **SONAR_TOKEN** (Code Quality) 🟡 IMPORTANTE

**¿Para qué?** Análisis de calidad de código (bugs, code smells, deuda técnica)

**¿Cómo obtenerlo?**
1. Regístrate en [SonarCloud.io](https://sonarcloud.io)
2. Crea un nuevo proyecto vinculado a tu repo GitHub
3. Ve a **My Account** → **Security** → **Generate Token**
4. Copia el token
5. Pégalo en GitHub Secrets como `SONAR_TOKEN`

**Frecuencia:** Análisis diario automático

---

### 3. **VERCEL_TOKEN** (Deployment) 🔴 CRÍTICO

**¿Para qué?** Deploy automático a Vercel en cada push a `main`

**¿Cómo obtenerlo?**
1. Ve a [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click en **Create Token**
3. Dale un nombre (ej: "GitHub Actions")
4. Copia el token
5. Pégalo en GitHub Secrets como `VERCEL_TOKEN`

---

### 4. **VERCEL_ORG_ID** (Deployment) 🔴 CRÍTICO

**¿Cómo obtenerlo?**
1. Ve a tu proyecto en Vercel
2. Settings → General
3. Copia el **Team ID** o **Personal Account ID**
4. Pégalo en GitHub Secrets como `VERCEL_ORG_ID`

---

### 5. **VERCEL_PROJECT_ID** (Frontend) 🔴 CRÍTICO

**¿Cómo obtenerlo?**
1. Ve a tu proyecto frontend en Vercel
2. Settings → General
3. Copia el **Project ID**
4. Pégalo en GitHub Secrets como `VERCEL_PROJECT_ID`

---

### 6. **VERCEL_BACKEND_PROJECT_ID** (Backend) 🟡 IMPORTANTE

**¿Cómo obtenerlo?**
1. Ve a tu proyecto backend en Vercel
2. Settings → General
3. Copia el **Project ID**
4. Pégalo en GitHub Secrets como `VERCEL_BACKEND_PROJECT_ID`

---

## 📝 **Cómo Añadir Secrets en GitHub**

### **Paso a paso:**

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (arriba a la derecha)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**
5. Añade cada secret:
   - **Name:** El nombre del secret (ej: `SNYK_TOKEN`)
   - **Value:** El valor del token
6. Click en **Add secret**

---

## ✅ **Checklist de Configuración**

### **Obligatorios (Para que funcione CI/CD):**

- [ ] `VERCEL_TOKEN`
- [ ] `VERCEL_ORG_ID`
- [ ] `VERCEL_PROJECT_ID`

### **Recomendados (Para seguridad y calidad):**

- [ ] `SNYK_TOKEN`
- [ ] `SONAR_TOKEN`
- [ ] `VERCEL_BACKEND_PROJECT_ID`

### **Opcionales (Para features adicionales):**

- [ ] `SLACK_WEBHOOK` (notificaciones)
- [ ] `DISCORD_WEBHOOK` (notificaciones)
- [ ] `CODECOV_TOKEN` (coverage reports)

---

## 🔍 **Verificar que Funciona**

### **Después de configurar los secrets:**

1. **Ve a Actions** en tu repo GitHub
2. **Selecciona un workflow** (ej: CI/CD Pipeline)
3. **Click en "Re-run jobs"** para probar

### **Workflows que deberían funcionar:**

- ✅ **CI/CD Pipeline** (lint, test, build, deploy)
- ✅ **Security Scan** (npm audit, Snyk, OWASP)
- ✅ **Daily Maintenance** (dependency updates, code quality)

---

## 🚨 **Troubleshooting**

### **Error: "Secret not found"**
- Verifica que el nombre del secret sea EXACTO (mayúsculas/minúsculas)
- Asegúrate de haberlo guardado en **Actions secrets** (no Environment secrets)

### **Error: "Unauthorized" en Vercel**
- Verifica que `VERCEL_TOKEN` sea válido
- Verifica que `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` sean correctos

### **Error en Snyk/SonarCloud**
- Verifica que el token tenga los permisos correctos
- Algunos tokens expiran, genera uno nuevo si es necesario

---

## 📊 **Estado Actual de Secrets**

Puedes verificar qué secrets tienes configurados en:
```
Settings → Secrets and variables → Actions → Repository secrets
```

---

## 🔄 **Renovación de Tokens**

### **¿Cada cuánto renovar?**

| Secret | Frecuencia | Motivo |
|--------|------------|--------|
| SNYK_TOKEN | Anual | Seguridad |
| SONAR_TOKEN | Anual | Seguridad |
| VERCEL_TOKEN | Cuando expire | Variable |

### **¿Cómo renovar?**

1. Genera un nuevo token en la plataforma correspondiente
2. Ve a GitHub Secrets
3. Click en el secret que quieres actualizar
4. Click en **Update secret**
5. Pega el nuevo valor
6. Click en **Update secret**

---

## 💡 **Mejores Prácticas**

### ✅ **DO:**
- Usa tokens con **permisos mínimos** necesarios
- Rota los tokens **regularmente**
- Guarda una copia segura de los tokens (password manager)
- Documenta qué hace cada token

### ❌ **DON'T:**
- No compartas tokens públicamente
- No los commitas al repositorio
- No uses el mismo token para múltiples propósitos
- No dejes tokens antiguos activos

---

## 📧 **Soporte**

Si tienes problemas con la configuración:

1. Revisa los logs de GitHub Actions
2. Verifica que los tokens sean válidos
3. Consulta la documentación de cada servicio:
   - [Snyk Docs](https://docs.snyk.io)
   - [SonarCloud Docs](https://docs.sonarcloud.io)
   - [Vercel Docs](https://vercel.com/docs)

---

**✅ Una vez configurados todos los secrets, tu sistema tendrá:**
- 🔒 Seguridad automática
- 🧪 Testing continuo
- 🚀 Deploy automático
- 📊 Calidad de código monitoreada
- 🔄 Mantenimiento diario automatizado

