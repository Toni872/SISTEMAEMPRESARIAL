# 🔍 Verificar CORS en Backend

## ✅ Variable Configurada Correctamente

Tu variable `BACKEND_CORS_ORIGINS` está bien configurada:
```
https://grand-grace-production.up.railway.app,https://sistemaempresarial-production.up.railway.app
```

---

## 🔄 Paso 1: Reiniciar el Backend

**MUY IMPORTANTE:** Después de cambiar variables de entorno, el backend debe reiniciarse:

1. Ve a Railway → Servicio **Backend**
2. Ve a la pestaña **"Deployments"**
3. Haz clic en **"Redeploy"** o busca el botón **"Restart"**
4. Espera a que termine el reinicio (30-60 segundos)
5. Verifica en los logs que el backend inició correctamente

---

## 🔍 Paso 2: Verificar en los Logs

Después de reiniciar, revisa los logs del backend:

1. Ve a Railway → Servicio **Backend**
2. Ve a la pestaña **"Logs"** o **"Deployments"** → Último deployment → Logs
3. Busca mensajes que indiquen que el servidor inició
4. No debería haber errores relacionados con CORS

---

## 🧪 Paso 3: Probar CORS Manualmente

Abre la consola del navegador (F12) en `https://grand-grace-production.up.railway.app` y ejecuta:

```javascript
fetch('https://sistemaempresarial-production.up.railway.app/api/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => {
  console.log('Status:', response.status);
  console.log('Headers:', [...response.headers.entries()]);
  return response.json();
})
.then(data => console.log('✅ CORS funciona:', data))
.catch(error => console.error('❌ Error CORS:', error));
```

Si ves los headers y la respuesta, CORS está funcionando.

---

## 🔍 Paso 4: Verificar que el Backend Está Usando la Variable

El código del backend debería estar usando `settings.cors_origins_list` que parsea `BACKEND_CORS_ORIGINS`. 

Si después de reiniciar sigue sin funcionar, puede ser que:
1. El backend no se reinició correctamente
2. Hay un problema con el parsing de la variable
3. Hay algún otro middleware bloqueando CORS

---

## ⚠️ Si Aún No Funciona

### Opción A: Verificar Formato de la Variable

Asegúrate de que en Railway la variable esté exactamente así (sin comillas adicionales):
```
BACKEND_CORS_ORIGINS = https://grand-grace-production.up.railway.app,https://sistemaempresarial-production.up.railway.app
```

### Opción B: Probar con `*` Temporalmente

Para probar si el problema es el formato, puedes temporalmente poner:
```
BACKEND_CORS_ORIGINS = *
```

Si funciona con `*`, entonces el problema es el formato de las URLs.

**Nota:** Usa `*` solo para probar, luego vuelve a las URLs específicas por seguridad.

---

## ✅ Checklist

- [ ] Variable `BACKEND_CORS_ORIGINS` configurada correctamente ✅
- [ ] Backend reiniciado después de cambiar la variable ⚠️
- [ ] Logs del backend muestran que inició correctamente
- [ ] Prueba manual de CORS funciona

---

## 🆘 Próximos Pasos

1. **Reinicia el backend** en Railway
2. **Espera 30-60 segundos**
3. **Prueba el frontend** nuevamente
4. Si sigue sin funcionar, comparte los logs del backend

