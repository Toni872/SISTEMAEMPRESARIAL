# 🚀 Instrucciones de Inicio - Sistema ERP Standalone

## ✅ Estado Actual

**El servidor frontend está FUNCIONANDO correctamente en:**
```
http://localhost:3001
```

## 🎯 Acceso al Sistema

### 1. Landing Page (Pública)
**URL:** http://localhost:3001/landing  
- No requiere autenticación
- Muestra toda la información del producto
- Botones para iniciar sesión o registrarse

### 2. Página de Login
**URL:** http://localhost:3001/login

**Credenciales de prueba:**
```
Usuario Administrador:
Email: admin@erp.com
Password: admin123

Usuario Normal:
Email: usuario@erp.com
Password: usuario123

Usuario Demo:
Email: demo@erp.com
Password: demo123
```

### 3. Página de Registro
**URL:** http://localhost:3001/register  
- Crear nuevos usuarios
- Los usuarios se guardan en localStorage

### 4. Dashboard (Privado)
**URL:** http://localhost:3001/dashboard  
- Requiere autenticación
- Muestra métricas en tiempo real
- Gráficos interactivos
- Facturas recientes
- Actividad del sistema

## 🔄 Flujo Recomendado de Prueba

1. **Abrir en navegador:** http://localhost:3001
   - Serás redirigido automáticamente a `/landing`

2. **Explorar la Landing Page:**
   - Scroll por todas las secciones
   - Probar el toggle de tema (dark/light)
   - Revisar features, testimonios, precios

3. **Iniciar Sesión:**
   - Click en "Iniciar sesión" o "Empieza gratis"
   - Usar credenciales: `admin@erp.com` / `admin123`
   - Serás redirigido al dashboard

4. **Explorar el Dashboard:**
   - Ver métricas actualizadas
   - Interactuar con los gráficos
   - Revisar las facturas recientes
   - Ver la actividad del sistema
   - Cambiar entre dark/light mode

5. **Cerrar Sesión:**
   - Click en "Cerrar sesión" en el navbar
   - Serás redirigido a la landing page

6. **Probar Registro:**
   - Click en "Empieza gratis"
   - Completar formulario con nuevos datos
   - Serás registrado y redirigido al dashboard

## 🎨 Características Destacadas

### ✅ Autenticación Standalone
- Sistema completo sin backend
- Datos en localStorage
- Sesión persistente entre recargas

### ✅ Datos Mock Realistas
- Métricas de negocio actualizadas
- Facturas con diferentes estados
- Actividad del sistema en tiempo real
- Productos y clientes de ejemplo

### ✅ Dark Mode Completo
- Toggle en navbar y landing
- Persistente entre sesiones
- Todos los componentes optimizados

### ✅ Diseño Profesional
- Inspirado en Linear, Vercel y Stripe
- Animaciones suaves con Framer Motion
- Responsive en todos los dispositivos
- Paleta de colores purple-blue gradient

## 🛠️ Comandos Útiles

### Detener el servidor
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Iniciar el servidor
```powershell
cd frontend-next
npm run dev
```

### Verificar que está corriendo
```powershell
curl http://localhost:3001 -UseBasicParsing
```

## 📊 Datos Mock Incluidos

### Productos (6)
- Laptop HP ProBook 450 (€899.99)
- Monitor Dell 27" 4K (€449.99)
- Teclado Mecánico Logitech (€129.99)
- Mouse MX Master 3 (€99.99)
- Silla Ergonómica Herman Miller (€1,299.99)
- Escritorio Ajustable SmartDesk (€599.99)

### Clientes (4)
- Tech Solutions SA (€15,499.85)
- Innovate SL (€8,750.50)
- Global Corp (€22,100.00)
- StartupHub (€5,200.75)

### Facturas (5)
- INV-001: Tech Solutions - €2,699.97 (Pagada)
- INV-002: Innovate - €1,349.97 (Pendiente)
- INV-003: Global Corp - €6,499.95 (Pagada)
- INV-004: StartupHub - €899.99 (Vencida)
- INV-005: Tech Solutions - €3,599.94 (Pagada)

### Métricas Dashboard
- Ingresos: €45,789.50 (+18.7%)
- Pedidos: 156 (+16.4%)
- Clientes: 48 (+14.3%)
- Ganancia: €18,945.75 (+19.2%)

## 🔧 Solución de Problemas

### El puerto 3001 está ocupado
```powershell
# Liberar el puerto
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Error al iniciar
```powershell
# Reinstalar dependencias
cd frontend-next
Remove-Item node_modules -Recurse -Force
npm install
npm run dev
```

### Datos no se guardan
- Los datos están en localStorage del navegador
- Si limpias el cache, se pierden
- Cada navegador tiene su propio localStorage

## 📝 Notas Importantes

1. **No hay backend activo** - Todo funciona en el frontend
2. **Datos en localStorage** - Se pierden al limpiar cache
3. **Puerto 3001** - Configurado para no conflictar
4. **Hot Reload activo** - Los cambios se reflejan automáticamente
5. **Modo desarrollo** - Optimizado para desarrollo, no producción

## 🎯 Siguiente Paso

**¡El sistema está listo para usar!**

Abre tu navegador y ve a: **http://localhost:3001**

---

**Disfruta tu nuevo Sistema ERP Standalone** 🚀

