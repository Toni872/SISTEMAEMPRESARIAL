# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al Sistema ERP! Esta guía te ayudará a comenzar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Guías de Estilo](#guías-de-estilo)
- [Estructura del Proyecto](#estructura-del-proyecto)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas un ambiente respetuoso y colaborativo.

## 🎯 ¿Cómo Puedo Contribuir?

### 🐛 Reportar Bugs

- Usa el template de **Bug Report**
- Describe claramente el problema y cómo reproducirlo
- Incluye capturas de pantalla si es posible
- Menciona tu entorno (OS, navegador, versión)

### ✨ Sugerir Mejoras

- Usa el template de **Feature Request**
- Explica el problema que resuelve tu sugerencia
- Describe la solución propuesta
- Considera alternativas

### 🌟 Tu Primera Contribución

¿Primera vez contribuyendo? Busca issues con estos labels:

- `good first issue` - Issues perfectos para comenzar
- `help wanted` - Issues que necesitan ayuda
- `documentation` - Mejoras a la documentación

### 💻 Pull Requests

1. **Fork el repositorio**
2. **Crea una rama** desde `master`:
   ```bash
   git checkout -b feature/mi-nueva-funcionalidad
   ```
3. **Haz tus cambios** siguiendo las guías de estilo
4. **Escribe tests** si aplica
5. **Ejecuta los tests**:
   ```bash
   # Backend
   cd backend
   npm test
   
   # Frontend
   cd frontend
   npm test
   ```
6. **Commit con mensajes claros**:
   ```bash
   git commit -m "feat: añadir nueva funcionalidad X"
   ```
7. **Push a tu fork**:
   ```bash
   git push origin feature/mi-nueva-funcionalidad
   ```
8. **Abre un Pull Request** usando el template

## 🔄 Proceso de Desarrollo

### Configuración Inicial

```bash
# Clonar el repositorio
git clone https://github.com/Toni872/SISTEMAEMPRESARIAL.git
cd SISTEMAEMPRESARIAL

# Instalar dependencias - Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev

# Instalar dependencias - Frontend
cd ../frontend
npm install

# Iniciar desarrollo
npm run dev
```

### Estructura de Ramas

- `master` - Rama principal (producción)
- `develop` - Rama de desarrollo
- `feature/*` - Nuevas funcionalidades
- `fix/*` - Corrección de bugs
- `docs/*` - Cambios en documentación
- `refactor/*` - Refactorización de código

### Commits Convencionales

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formato, punto y coma faltante, etc.
refactor: refactorización de código
test: añadir tests
chore: actualizar dependencias, etc.
```

Ejemplos:
```bash
feat: añadir filtro por fecha en dashboard
fix: corregir cálculo de totales en ventas
docs: actualizar guía de instalación
refactor: simplificar lógica de autenticación
```

## 🎨 Guías de Estilo

### TypeScript/JavaScript

- Usar TypeScript para todo el código nuevo
- Seguir ESLint y Prettier (configurados en el proyecto)
- Usar tipos explícitos
- Documentar funciones complejas con JSDoc

```typescript
/**
 * Calcula el total de una factura
 * @param items - Array de items de la factura
 * @returns El total calculado
 */
function calculateTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}
```

### React/Frontend

- Componentes funcionales con hooks
- Props con TypeScript interfaces
- CSS con TailwindCSS
- Nombres descriptivos en inglés

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};
```

### Backend/NestJS

- DTOs para validación
- Services para lógica de negocio
- Guards para autenticación
- Documentar endpoints con decoradores

```typescript
@ApiOperation({ summary: 'Obtener productos' })
@ApiResponse({ status: 200, description: 'Lista de productos' })
@Get()
async findAll(@Query() query: GetProductsDto) {
  return this.productsService.findAll(query);
}
```

### Tests

- Describir qué se está probando
- Un test por comportamiento
- Usar nombres descriptivos

```typescript
describe('ProductsService', () => {
  describe('findAll', () => {
    it('should return all products', async () => {
      const result = await service.findAll({});
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter by category', async () => {
      const result = await service.findAll({ category: 'Electronics' });
      expect(result.every(p => p.category === 'Electronics')).toBe(true);
    });
  });
});
```

## 📁 Estructura del Proyecto

```
sistemaempresarial/
├── backend/              # Backend NestJS
│   ├── src/
│   │   ├── modules/     # Módulos de funcionalidad
│   │   ├── common/      # Servicios compartidos
│   │   └── config/      # Configuración
│   ├── prisma/          # Schema y migraciones
│   └── test/            # Tests E2E
├── frontend/            # Frontend React
│   ├── src/
│   │   ├── pages/       # Páginas
│   │   ├── components/  # Componentes reutilizables
│   │   ├── services/    # Servicios API
│   │   └── lib/         # Utilidades
│   └── public/          # Assets estáticos
├── docs/                # Documentación
└── .github/             # Workflows y templates
```

## 🧪 Tests

### Ejecutar Tests

```bash
# Backend - Unit tests
cd backend
npm test

# Backend - E2E tests
npm run test:e2e

# Backend - Coverage
npm run test:cov

# Frontend - Tests
cd frontend
npm test

# Frontend - Coverage
npm run test:coverage
```

### Escribir Tests

- **Unit tests**: Para funciones y servicios individuales
- **Integration tests**: Para módulos completos
- **E2E tests**: Para flujos completos de usuario

## 🔍 Code Review

Todos los PRs pasan por code review. Buscamos:

- ✅ Código limpio y mantenible
- ✅ Tests que cubren los cambios
- ✅ Documentación actualizada
- ✅ Sin errores de linting
- ✅ Build exitoso
- ✅ Commits bien formateados

## 📚 Recursos

- [Documentación del Proyecto](../docs/)
- [Guía de API](../backend/docs/API_REFERENCE.md)
- [Guía de Autenticación](../backend/docs/AUTHENTICATION_GUIDE.md)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)

## 💬 ¿Preguntas?

- Abre un [Discussion](https://github.com/Toni872/SISTEMAEMPRESARIAL/discussions)
- Comenta en el issue relevante
- Revisa la documentación en `/docs`

## 🙏 Agradecimientos

¡Gracias por contribuir al Sistema ERP! Cada contribución, grande o pequeña, es valiosa.

---

**Happy Coding! 🚀**

