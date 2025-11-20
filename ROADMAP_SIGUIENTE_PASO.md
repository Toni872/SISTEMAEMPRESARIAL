# Roadmap - Siguiente Paso Recomendado

**Fecha:** 19 de Noviembre de 2025  
**Estado:** Verifactu completado ✅

---

## ✅ FUNCIONALIDADES COMPLETADAS

1. ✅ **Facturas Recurrentes** - Sistema completo de facturación automática
2. ✅ **Plantillas de Factura** - Múltiples plantillas personalizables
3. ✅ **Modelos Fiscales Españoles** - Modelo 303 (IVA) y Modelo 111 (IRPF)
4. ✅ **Generación PDF** - PDFs profesionales para declaraciones fiscales
5. ✅ **Verifactu** - Sistema completo de registro conforme a normativa AEAT

---

## 🎯 SIGUIENTE PASO RECOMENDADO

### **OPCIÓN 1: Módulo de Compras** ⭐ RECOMENDADO

**Prioridad:** 🔴 ALTA  
**Estimado:** 1 semana  
**Impacto:** Alto - Completa el ciclo contable

**Por qué ahora:**
- Necesario para completar el Modelo 303 (IVA soportado)
- Complementa el módulo de ventas existente
- Base para futuras funcionalidades (conciliación, proveedores)

**Funcionalidades a implementar:**

#### Backend:
- [ ] Modelo `Purchase` (compra) y `PurchaseItem`
- [ ] Modelo `Supplier` (proveedor)
- [ ] CRUD completo de compras
- [ ] CRUD de proveedores
- [ ] Cálculo de IVA soportado
- [ ] Integración con Modelo 303 (IVA soportado)

#### Frontend:
- [ ] Página de compras (listado)
- [ ] Formulario crear/editar compra
- [ ] Página de proveedores
- [ ] Formulario crear/editar proveedor
- [ ] Integración con dashboard (gastos)

**Endpoints necesarios:**
```
GET    /api/purchases              - Listar compras
POST   /api/purchases              - Crear compra
GET    /api/purchases/{id}         - Obtener compra
PUT    /api/purchases/{id}         - Actualizar compra
DELETE /api/purchases/{id}         - Eliminar compra

GET    /api/suppliers              - Listar proveedores
POST   /api/suppliers              - Crear proveedor
GET    /api/suppliers/{id}         - Obtener proveedor
PUT    /api/suppliers/{id}         - Actualizar proveedor
DELETE /api/suppliers/{id}         - Eliminar proveedor
```

---

### **OPCIÓN 2: Integración Bancaria**

**Prioridad:** 🔴 ALTA  
**Estimado:** 1-2 semanas  
**Impacto:** Muy Alto - Diferenciador clave

**Proveedores recomendados para España:**
1. **Tink** - Especializado en España, buena documentación
2. **TrueLayer** - Buena cobertura europea
3. **Plaid** - Más internacional, menos bancos españoles

**Funcionalidades:**
- [ ] OAuth2 flow para conectar bancos
- [ ] Sincronización de transacciones
- [ ] Conciliación automática con facturas
- [ ] UI para gestionar conexiones bancarias

**Complejidad:** Media-Alta (requiere investigación de proveedores)

---

### **OPCIÓN 3: OCR de Gastos**

**Prioridad:** 🟡 MEDIA  
**Estimado:** 3-5 días  
**Impacto:** Alto - Mejora UX significativamente

**Opciones de OCR:**
1. **Google Vision API** - Fácil, pago por uso
2. **AWS Textract** - Buena calidad
3. **Tesseract** - Gratis pero menos preciso

**Funcionalidades:**
- [ ] Subir imagen de recibo/ticket
- [ ] Extracción automática de datos (fecha, importe, IVA)
- [ ] Crear compra automáticamente desde OCR
- [ ] UI para revisar y corregir datos extraídos

**Complejidad:** Media (requiere integración con servicio OCR)

---

## 💡 RECOMENDACIÓN FINAL

### **Empezar con: Módulo de Compras**

**Razones:**
1. ✅ Completa el ciclo contable básico
2. ✅ Necesario para Modelo 303 completo (IVA soportado)
3. ✅ Base sólida para futuras funcionalidades
4. ✅ No requiere integraciones externas
5. ✅ Puede implementarse rápidamente (1 semana)

**Después de Compras:**
- Integración Bancaria (para conciliación automática)
- OCR de Gastos (para facilitar registro de compras)

---

## 📊 PROGRESO GENERAL

**Completado:** 5/8 funcionalidades principales  
**Progreso:** ~62% del roadmap inicial

**Próximos 3 meses:**
- ✅ Compras (1 semana)
- ✅ Integración Bancaria (2 semanas)
- ✅ OCR de Gastos (1 semana)
- ✅ Mejoras y optimizaciones

---

## 🚀 ¿Comenzamos con Compras?

Esta funcionalidad es la más lógica como siguiente paso porque:
- Completa el sistema básico de gestión empresarial
- Permite calcular correctamente el IVA soportado en Modelo 303
- Es relativamente rápida de implementar
- No requiere investigación externa

¿Procedemos con el módulo de Compras?

