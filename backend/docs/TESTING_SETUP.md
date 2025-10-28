# Testing Setup - Sistema ERP

## Configuración de Testing

### Backend Testing

#### Unit Tests

```bash
# Ejecutar tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests en modo watch
npm run test:watch
```

#### Integration Tests

```bash
# Tests de integración con base de datos
npm run test:e2e
```

#### Test Files Structure

```
backend/
├── test/
│   ├── auth.e2e-spec.ts
│   ├── products.e2e-spec.ts
│   └── sales.e2e-spec.ts
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.service.spec.ts
│   │   │   └── auth.controller.spec.ts
│   │   └── products/
│   │       └── products.service.spec.ts
```

### Frontend Testing

#### Unit Tests

```bash
# Ejecutar tests
npm run test

# Tests con UI
npm run test:ui

# Tests con coverage
npm run test:coverage
```

#### Test Files Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ProductCard.test.tsx
│   │   └── UserForm.test.tsx
│   ├── pages/
│   │   └── LoginPage.test.tsx
│   └── services/
│       └── api.test.ts
```

## Configuración de Jest (Backend)

### jest.config.js

```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.interface.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
```

### test/setup.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/common/prisma.service';

beforeAll(async () => {
  // Setup test database
  const module: TestingModule = await Test.createTestingModule({
    providers: [PrismaService],
  }).compile();

  const prismaService = module.get<PrismaService>(PrismaService);
  await prismaService.cleanDatabase();
});

afterAll(async () => {
  // Cleanup test database
});
```

## Configuración de Vitest (Frontend)

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
});
```

### src/test/setup.ts

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});
```

## Test Data y Fixtures

### Backend Test Data

```typescript
// test/fixtures/user.fixtures.ts
export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'admin123',
    role: 'ADMIN',
    firstName: 'Admin',
    lastName: 'User',
  },
  manager: {
    email: 'manager@test.com',
    password: 'manager123',
    role: 'MANAGER',
    firstName: 'Manager',
    lastName: 'User',
  },
};

// test/fixtures/product.fixtures.ts
export const testProducts = {
  laptop: {
    name: 'Test Laptop',
    sku: 'TEST-LAP-001',
    price: 1000,
    cost: 800,
    stock: 10,
    category: 'Electronics',
  },
};
```

### Frontend Test Data

```typescript
// src/test/fixtures/product.fixtures.ts
export const mockProducts = [
  {
    id: 1,
    name: 'Test Product',
    sku: 'TEST-001',
    price: 100,
    stock: 50,
    category: 'Test Category',
  },
];

// src/test/fixtures/user.fixtures.ts
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'USER',
};
```

## Test Utilities

### Backend Test Utils

```typescript
// test/utils/test.utils.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/common/prisma.service';

export async function createTestingModule(providers: any[] = []) {
  return Test.createTestingModule({
    providers: [
      PrismaService,
      ...providers,
    ],
  }).compile();
}

export async function cleanDatabase(prisma: PrismaService) {
  await prisma.cleanDatabase();
}
```

### Frontend Test Utils

```typescript
// src/test/utils/test.utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## Coverage Reports

### Backend Coverage

- **Threshold**: 80% overall coverage
- **Critical paths**: 90% coverage for auth, products, sales modules
- **Reports**: HTML, JSON, LCOV formats

### Frontend Coverage

- **Threshold**: 70% overall coverage
- **Critical paths**: 85% coverage for components and services
- **Reports**: HTML, JSON formats

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run Backend Tests
  run: |
    cd backend
    npm run test:cov
    
- name: Run Frontend Tests
  run: |
    cd frontend
    npm run test:coverage
    
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./backend/coverage/lcov.info,./frontend/coverage/lcov.info
```

## Best Practices

1. **Test Naming**: Use descriptive names that explain the scenario
2. **AAA Pattern**: Arrange, Act, Assert
3. **Mock External Dependencies**: Database, APIs, file system
4. **Test Data Isolation**: Each test should be independent
5. **Coverage Goals**: Maintain high coverage on critical paths
6. **Performance Tests**: Include load testing for critical endpoints
7. **E2E Tests**: Cover main user journeys

## Debugging Tests

### Backend

```bash
# Debug specific test
npm run test -- --testNamePattern="should create user"

# Debug with Node inspector
npm run test:debug
```

### Frontend

```bash
# Debug with UI
npm run test:ui

# Debug specific test file
npm run test -- ProductCard.test.tsx
```

