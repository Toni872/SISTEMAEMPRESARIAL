/*
📦  Crear un proyecto frontend moderno con Vite, React, TypeScript, TailwindCSS y
🚀  API consumption con TanStack Query + Zustand, usando la API que ya está corriendo
   en Docker (Postman es la herramienta de pruebas).  
⚙️  Se usarán variables de entorno para apuntar a la URL del backend y se
   configurará un router con React‑Router v6.  
🔧  La estructura de carpetas seguirá el patrón “feature‑centric”:

src/
 ├─ app/            # App.jsx, index.tsx, router.tsx, store.ts
 ├─ common/         # utilidades comunes, hooks de autenticación, etc.
 ├─ features/       # carpetas por cada dominio (users, products, auth, etc.)
 ├─ graphql/        # queries/mutations (si usaras GraphQL)
 ├─ services/       # API layer (TanStack Query, Zustand, etc.)
 ├─ styles/         # tailwind.css, global.css
 └─ tests/          # pruebas unitarias y de integración

💡  Los pasos que Copilot debe seguir:

1️⃣  Crear proyecto Vite con plantilla React + TypeScript.
2️⃣  Instalar y configurar Tailwind + PostCSS + Autoprefixer.
3️⃣  Configurar .env.local para:
    VITE_API_BASE_URL=http://localhost:8000   // (o el puerto de tu contenedor Docker)
4️⃣  Instalar React‑Router v6 y crear router con rutas de ejemplo.
5️⃣  Instalar TanStack Query y crear un store de Zustand con un “auth” slice.
6️⃣  Crear un servicio de API (services/api.ts) con TanStack Query:
     • getProducts, getProduct, addProduct, updateProduct, deleteProduct
   (adaptar a tu backend REST – revisa Postman para ver los endpoints).
7️⃣  Crear un componente “ProductList” que muestre una lista de productos
   usando useProductsQuery y un botón “Refresh”.
8️⃣  Crear un componente “ProductForm” que use useAddProductMutation
   y el hook de formulario de react-hook-form + zod para validación.
9️⃣  Añadir un “FullScreenSpinner” para usar con React.Suspense.
🔟  Añadir ESLint + Prettier + husky + lint‑staged.
11️⃣  Añadir Storybook con un template base (opcional).
12️⃣  Crear un script de build “vite build” y de lint “npm run lint”.

🛠️  Si tu backend está corriendo en Docker con el puerto 8000,
    Postman puede usar `http://localhost:8000/api/...`.  
    Asegúrate de que la variable `VITE_API_BASE_URL` coincida.

📦  Copilot debe generar:

- `vite.config.ts` con la configuración básica.
- `postcss.config.cjs` y `tailwind.config.js`.
- `src/styles/index.css` importando `@tailwind base; ...`.
- `src/app/index.tsx` que inicie el router y el query client.
- `src/services/api.ts` con la capa de TanStack Query.
- `src/features/products/ProductList.tsx` y `ProductForm.tsx`.
- `src/common/Spinner.tsx` (FullScreenSpinner).
- `src/app/store.ts` con Zustand store y auth slice.
- `src/router.tsx` con las rutas básicas.
- Scripts en `package.json` (`dev`, `build`, `lint`, `test`, `storybook`).

🔖  Finaliza con un README.md breve que explique cómo:

1.  `docker-compose up` (si usas docker‑compose) para levantar el backend.
2.  `npm install && npm run dev` para arrancar el frontend.
3.  `npm run build` para producción.

⚙️  Si quieres usar GraphQL en vez de REST, sustituye “services/api.ts”
    por “graphql/queries.ts” y usa `graphql-codegen` + `@apollo/client`.  

Con este prompt Copilot podrá producir la “capa frontend” lista para integrarse
con tu Docker + Postman backend. ¡Vamos allá! 🚀
*/

