# Guía para Probar Módulo de Compras en Swagger

## Paso 1: Abrir Swagger UI

Abre en tu navegador: **<http://localhost:8000/docs>**

---

## Paso 2: Autenticación

Hay dos formas de autenticarte. **Recomendamos la Opción 1** (más simple y confiable).

### Opción 1: Login Directo (Recomendado) ✅

1. Busca el endpoint: **POST /api/auth/login**
2. Haz clic en **"Try it out"**
3. Completa el formulario con estas credenciales:

   - **grant_type**: `password` (ya viene por defecto)
   - **username**: `test@example.com` ⚠️ (OAuth2 usa "username" para el email)
   - **password**: `testpassword123`
   - **scope**: Déjalo vacío
   - **client_id**: Déjalo vacío
   - **client_secret**: Déjalo vacío

4. Haz clic en **"Execute"**
5. En la respuesta (código 200), busca el campo **`access_token`** y copia su valor completo (sin comillas)
6. Haz clic en el botón **"Authorize"** 🔒 (arriba a la derecha de Swagger UI)
7. En el campo **"Value"**, pega solo el token (sin escribir "Bearer" antes)
8. Haz clic en **"Authorize"** y luego en **"Close"**
9. Verás un candado cerrado 🔒 junto a los endpoints protegidos

### Opción 2: Usar el Diálogo de Autorización

Si prefieres usar el diálogo de autorización directamente:

1. Haz clic en el botón **"Authorize"** 🔒 (arriba a la derecha)
2. En el diálogo que aparece, completa:
   - **username**: `test@example.com`
   - **password**: `testpassword123`
   - **client_id**: Déjalo vacío
   - **client_secret**: Déjalo vacío
3. Haz clic en **"Authorize"**

⚠️ **Nota**: Si el diálogo de autorización no funciona bien, usa la Opción 1.

### Credenciales de Prueba

- **Email/Username**: `test@example.com`
- **Contraseña**: `testpassword123`

Si necesitas crear o resetear este usuario, ejecuta:

```bash
docker exec erp-backend-fastapi python /code/scripts/reset_test_user_password.py
```

---

## Paso 3: Crear un Proveedor

1. Busca: **POST /api/purchases/suppliers**
2. Haz clic en **"Try it out"**
3. Usa este JSON de ejemplo:

```json
{
  "name": "TechSupply SA",
  "tax_id": "B12345678",
  "email": "contacto@techsupply.com",
  "phone": "+34 912 345 678",
  "address": "Calle Ejemplo 123",
  "city": "Madrid",
  "postal_code": "28001",
  "country": "España",
  "contact_person": "Juan Pérez",
  "is_active": true
}
```

4. Haz clic en **"Execute"**
5. Guarda el **`id`** del proveedor creado (lo necesitarás para crear compras)

---

## Paso 4: Listar Proveedores

1. Busca: **GET /api/purchases/suppliers**
2. Haz clic en **"Try it out"**
3. Haz clic en **"Execute"**
4. Verás la lista de proveedores creados

---

## Paso 5: Crear una Compra

1. Busca: **POST /api/purchases**
2. Haz clic en **"Try it out"**
3. Usa este JSON de ejemplo (reemplaza `supplier_id` con el ID del proveedor que creaste):

```json
{
  "supplier_id": 1,
  "purchase_date": "2025-11-19T10:00:00",
  "status": "pending",
  "notes": "Compra de prueba",
  "items": [
    {
      "description": "Producto A",
      "quantity": 10,
      "unit_price": 50.00,
      "tax_rate": 21.0,
      "subtotal": 500.00
    },
    {
      "description": "Producto B",
      "quantity": 5,
      "unit_price": 30.00,
      "tax_rate": 21.0,
      "subtotal": 150.00
    }
  ]
}
```

4. Haz clic en **"Execute"**
5. Verás la compra creada con su número automático (ej: COMP-20251119-0001)

---

## Paso 6: Listar Compras

1. Busca: **GET /api/purchases**
2. Haz clic en **"Try it out"**
3. Haz clic en **"Execute"**
4. Verás todas las compras creadas

---

## Paso 7: Ver en el Frontend

1. Abre: **<http://localhost:3001/purchases>**
2. Deberías ver los proveedores y compras que creaste
3. Las estadísticas se calcularán automáticamente

---

## Endpoints Disponibles

### Proveedores

- `GET /api/purchases/suppliers` - Listar proveedores
- `POST /api/purchases/suppliers` - Crear proveedor
- `GET /api/purchases/suppliers/{id}` - Obtener proveedor
- `PUT /api/purchases/suppliers/{id}` - Actualizar proveedor
- `DELETE /api/purchases/suppliers/{id}` - Eliminar proveedor

### Compras

- `GET /api/purchases` - Listar compras
- `POST /api/purchases` - Crear compra
- `GET /api/purchases/{id}` - Obtener compra
- `PUT /api/purchases/{id}` - Actualizar compra
- `DELETE /api/purchases/{id}` - Eliminar compra

---

## Notas Importantes

- **Autenticación**: Necesitas estar autenticado para usar todos los endpoints
- **supplier_id**: Para crear una compra, primero debes crear un proveedor
- **Números automáticos**: Las compras tienen números automáticos (COMP-YYYYMMDD-XXXX)
- **Cálculo de totales**: Si no envías subtotal/tax/total, se calculan automáticamente desde los items

---

## Solución de Problemas

### Error 401 (Unauthorized) - "Incorrect email or password"

- Verifica que estés usando las credenciales correctas:
  - Username: `test@example.com` (no olvides el @)
  - Password: `testpassword123`
- Si el error persiste, resetea la contraseña del usuario:

  ```bash
  docker exec erp-backend-fastapi python /code/scripts/reset_test_user_password.py
  ```

### Error 401 (Unauthorized) - "Could not validate credentials"

- Asegúrate de haber hecho clic en "Authorize" y pegado el token correctamente
- El token debe pegarse sin "Bearer" antes
- Verifica que el token no haya expirado (válido por 30 minutos)
- Si expiró, vuelve a hacer login y copia el nuevo token

### Error 404 (Not Found)

- Verifica que el ID que estás usando existe
- Asegúrate de haber creado el recurso primero (proveedor, compra, etc.)

### Error 422 (Validation Error)

- Revisa que el JSON tenga el formato correcto
- Verifica que los campos requeridos estén presentes
- Comprueba los tipos de datos (números sin comillas, fechas en formato ISO)

### El botón "Authorize" no aparece

- Asegúrate de estar en la página correcta: `http://localhost:8000/docs`
- Recarga la página si es necesario
