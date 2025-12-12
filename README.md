# Sportclub Challenge - Monorepo

Challenge técnico full-stack con arquitectura de microservicios usando Docker Compose.

## Descripción

Monorepo que contiene:
- **Backend**: API REST en NestJS con Clean Architecture
- **Frontend**: Aplicación React con TypeScript  
- **Docker**: Orquestación completa con docker-compose
- **Swagger**: Documentación OpenAPI autogenerada

## Arquitectura

### Backend (NestJS + TypeScript)

Implementa **Arquitectura Hexagonal** (Ports & Adapters) para máxima independencia del dominio:

```
backend/
├── src/
│   ├── domain/                    # Núcleo de negocio (sin dependencias)
│   │   ├── entities/             # Entidades de dominio
│   │   ├── exceptions/           # Excepciones de negocio
│   │   └── ports/
│   │       ├── input/            # Puertos de entrada (casos de uso)
│   │       └── output/           # Puertos de salida (repositorios, APIs)
│   ├── application/              # Lógica de aplicación
│   │   └── services/            # Servicios que implementan puertos de entrada
│   ├── adapters/                 # Adaptadores externos
│   │   ├── input/               # Adaptadores de entrada (REST, GraphQL, CLI)
│   │   │   └── rest/           # Controllers, DTOs
│   │   └── output/              # Adaptadores de salida (DB, HTTP, etc)
│   │       └── sportclub/      # Implementaciones Sportclub API
│   └── beneficios/               # Módulo NestJS (configuración DI)
├── Dockerfile
└── Dockerfile.dev
```

**Características:**
- Arquitectura Hexagonal (Ports & Adapters)
- Domain-Driven Design (DDD)
- Inversión de dependencias
- Puertos claramente definidos
- Adaptadores intercambiables
- Swagger/OpenAPI documentation
- Manejo robusto de errores
- Logging opcional
- 100% test coverage (35 tests)
- Timeout handling
- CORS configurado

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── SearchBox/
│   │   ├── BeneficiosList/
│   │   └── BeneficioDetail/
│   ├── pages/           # Páginas principales
│   │   ├── BeneficiosPage.tsx
│   │   └── BeneficioDetailPage.tsx
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API clients
│   ├── store/           # State management
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── Dockerfile
└── Dockerfile.dev
```

**Características:**
- React 18 con TypeScript estricto
- React Query para data fetching y caché
- Zustand para state management (favorites con localStorage)
- React Router para navegación SPA
- Bootstrap 5 + React Bootstrap para UI
- Paginación (12 items por página)
- Búsqueda en tiempo real y filtros (activo/inactivo)
- Sistema de favoritos persistente
- Validación de fechas de vencimiento
- Badges de estado (Activo/Inactivo/Vencido)
- Responsive design (mobile-first)
- Loading states y error handling
- 63 tests con Vitest + React Testing Library
- Integración con API real de Sportclub

## Inicio Rápido

### Requisitos Previos
- Docker Desktop instalado y corriendo
- Node.js 20+ (solo para desarrollo local sin Docker)

### Opción 1: Levantar con Docker (Recomendado)

#### Configuración inicial (solo primera vez)

```bash
# Clonar el repositorio
git clone <repo-url>
cd sportclub-challenge

# Copiar el archivo de variables de entorno para Docker
cp .env.example .env
```

**Nota:** Con Docker NO necesitas copiar los `.env` de `backend/` ni `frontend/`. El `.env` de la raíz configura todo.

El archivo `.env` en la raíz configura ambos servicios (backend y frontend). Puedes modificar los puertos y URLs según necesites:

```env
# Puertos
BACKEND_PORT=3000
FRONTEND_PORT=3001

# URLs
SPORTCLUB_API_URL=https://asociate-api-challenge.prod.sportclub.com.ar/api
REACT_APP_API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# Otros
API_TIMEOUT=30000
NODE_ENV=production
```

#### Modo Desarrollo (con hot reload)
```bash
# Levantar servicios en modo desarrollo
docker-compose -f docker-compose.dev.yml up --build
```

Esto levantará:
- Backend en http://localhost:3000 (o el puerto configurado en BACKEND_PORT)
- Frontend en http://localhost:3001 (o el puerto configurado en FRONTEND_PORT)
- Swagger docs en http://localhost:3000/api/docs

#### Modo Producción
```bash
docker-compose up --build
```

### URLs de acceso
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Swagger/API Docs**: http://localhost:3000/api/docs
- **Health check**: http://localhost:3000/api/beneficios

### Detener los servicios
```bash
# Modo desarrollo
docker-compose -f docker-compose.dev.yml down

# Modo producción
docker-compose down

# Con limpieza de volúmenes
docker-compose down -v
```

## Documentación API (Swagger)

La API cuenta con documentación interactiva OpenAPI/Swagger disponible en:

```
http://localhost:3000/api/docs
```

**Características de Swagger:**
- Documentación completa de todos los endpoints
- Interfaz para probar los endpoints directamente
- Schemas detallados de request/response
- Descripciones y ejemplos para cada campo
- Respuestas de error documentadas

## Testing

### Backend - Ejecutar tests
```bash
cd backend

# Todos los tests
npm test

# Con coverage
npm run test:cov

# Watch mode
npm run test:watch
```

**Cobertura actual: 95.23%**
- Statements: 95.23%
- Branches: 80.48%
- Functions: 100%
- Lines: 94.73%

### Tests implementados
- Unit tests para casos de uso
- Tests del repositorio
- Tests del HTTP client
- Tests del controller
- Tests del exception filter

### Frontend - Ejecutar tests
```bash
cd frontend

# Todos los tests
npm test

# Watch mode (desarrollo)
npm test -- --watch

# Con UI interactiva
npm test -- --ui
```

**Tests: 63/63 passing (100%)**
- Component tests (Header, SearchBox, BeneficiosList, BeneficioDetail)
- Page tests (BeneficiosPage, BeneficioDetailPage)
- Hook tests (useBeneficios)
- Store tests (Zustand favorites)
- Service tests (API client)

## Opción 2: Desarrollo Local (sin Docker)

**Solo si necesitas desarrollar sin Docker. Requiere Node.js 20+ instalado.**

### Paso 1: Backend
```bash
cd backend

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env

# Modo desarrollo (hot reload)
npm run start:dev
```

El backend estará en http://localhost:3000

### Paso 2: Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
```

**IMPORTANTE**: Asegúrate de que el `.env` del frontend apunte al backend:
```env
REACT_APP_API_URL=http://localhost:3000
```

```bash
# Modo desarrollo (hot reload)
npm run dev
```

El frontend estará en http://localhost:5173 (Vite usa este puerto por defecto)

### Otros comandos útiles

**Backend:**
```bash
# Build para producción
npm run build

# Ejecutar en producción
npm run start:prod

# Tests
npm test

# Tests con coverage
npm run test:cov
```

**Frontend:**
```bash
# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Tests
npm test

# Tests en watch mode
npm test -- --watch
```

## Configuración

El proyecto utiliza tres niveles de configuración con archivos `.env`:

### 1. Variables de Entorno - Raíz (para Docker Compose)

Archivo: `.env.example` en la raíz → copiar a `.env`

```env
# Docker Compose Environment Variables

# Backend Configuration
NODE_ENV=production
BACKEND_PORT=3000
SPORTCLUB_API_URL=https://asociate-api-challenge.prod.sportclub.com.ar/api
API_TIMEOUT=30000

# Frontend Configuration
FRONTEND_PORT=3001
REACT_APP_API_URL=http://localhost:3000

# CORS
FRONTEND_URL=http://localhost:3001
```

**Uso:** Docker Compose lee este archivo para configurar los contenedores.

```bash
# Copiar en la raíz del proyecto
cp .env.example .env
```

### 2. Variables de Entorno - Backend

Archivo: `backend/.env.example` → copiar a `backend/.env`

```env
# Environment variables
NODE_ENV=development
PORT=3000

# Sportclub API Configuration
SPORTCLUB_API_URL=https://asociate-api-challenge.prod.sportclub.com.ar/api
API_TIMEOUT=10000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

**Uso:** Solo necesario para desarrollo local sin Docker.

```bash
cd backend
cp .env.example .env
```

### 3. Variables de Entorno - Frontend

Archivo: `frontend/.env.example` → copiar a `frontend/.env`

```env
# Environment variables
REACT_APP_API_URL=http://localhost:3000
```

**Uso:** Solo necesario para desarrollo local sin Docker.

```bash
cd frontend
cp .env.example .env
```

### Resumen de configuración

| Escenario | .env necesarios | Explicación |
|-----------|----------------|-------------|
| **Docker (desarrollo o producción)** | Solo `.env` en la raíz | Docker Compose inyecta las variables a los contenedores |
| **Desarrollo local sin Docker** | `backend/.env` + `frontend/.env` | Cada aplicación lee su propio .env |
| **Cambiar puertos** | Editar `.env` raíz (BACKEND_PORT, FRONTEND_PORT) | Docker usa estos puertos |

### Importante sobre archivos .env

- **`.env.example`**: Están en el repositorio, son plantillas con valores por defecto
- **`.env`**: Están en `.gitignore`, NO se suben al repositorio, debes crearlos localmente
- **Para Docker**: Solo necesitas copiar `.env.example` → `.env` en la raíz
- **Sin Docker**: Necesitas copiar los `.env.example` de backend y frontend

```bash
# Con Docker (solo esto)
cp .env.example .env

# Sin Docker (desarrollo local)
cd backend && cp .env.example .env && cd ..
cd frontend && cp .env.example .env && cd ..
```

## Comandos Docker

### Desarrollo
```bash
# Levantar servicios
docker-compose -f docker-compose.dev.yml up

# Rebuild y levantar
docker-compose -f docker-compose.dev.yml up --build

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Bajar servicios
docker-compose -f docker-compose.dev.yml down

# Limpiar volúmenes
docker-compose -f docker-compose.dev.yml down -v
```

### Producción
```bash
# Levantar servicios
docker-compose up

# Rebuild y levantar
docker-compose up --build

# En background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Bajar servicios
docker-compose down
```

## Estructura del Proyecto

```
sportclub/
├── backend/
│   ├── src/
│   │   ├── domain/                      # Núcleo de negocio (sin dependencias)
│   │   │   ├── entities/               # Entidades del dominio
│   │   │   │   └── beneficio.entity.ts
│   │   │   ├── exceptions/             # Excepciones de negocio
│   │   │   │   └── domain.exceptions.ts
│   │   │   └── ports/                  # Interfaces (contratos)
│   │   │       ├── input/              # Puertos de entrada
│   │   │       │   └── beneficios.service.port.ts
│   │   │       └── output/             # Puertos de salida
│   │   │           ├── beneficios.repository.port.ts
│   │   │           └── http-client.port.ts
│   │   ├── application/                # Lógica de aplicación
│   │   │   └── services/              # Implementa puertos de entrada
│   │   │       └── beneficios.service.ts
│   │   ├── adapters/                   # Adaptadores (infraestructura)
│   │   │   ├── input/                 # Adaptadores de entrada
│   │   │   │   └── rest/              # REST API
│   │   │   │       ├── beneficios.controller.ts
│   │   │   │       └── dtos/          # DTOs y validación
│   │   │   └── output/                # Adaptadores de salida
│   │   │       └── sportclub/         # Implementaciones Sportclub
│   │   │           ├── sportclub-http.client.ts
│   │   │           └── sportclub-beneficios.repository.ts
│   │   ├── beneficios/                 # Módulo NestJS (DI)
│   │   │   └── beneficios.module.ts
│   │   ├── presentation/               # Filters globales
│   │   │   └── filters/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── coverage/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── docker-compose.dev.yml
├── .gitignore
└── README.md
```

## Principios Arquitectónicos (Backend)

### Arquitectura Hexagonal

El backend sigue estrictamente los principios de Ports & Adapters:

1. **Domain (Núcleo)**
   - Sin dependencias externas
   - Define entidades y reglas de negocio
   - Define interfaces (puertos) pero no implementaciones

2. **Application (Casos de Uso)**
   - Orquesta la lógica de negocio
   - Implementa puertos de entrada (input)
   - Depende solo de domain

3. **Adapters**
   - **Input (Entrada)**: REST API, GraphQL, CLI
   - **Output (Salida)**: Bases de datos, APIs externas, File system
   - Implementan puertos de salida (output)

4. **Inversión de Dependencias**
   - Domain define interfaces
   - Adapters implementan interfaces
   - Application usa interfaces (no implementaciones)

### Flujo de Dependencias

```
Controller → ServicePort → Service → RepositoryPort → Repository → HttpClientPort → HttpClient
  (REST)     (Interface)    (App)     (Interface)      (Adapter)    (Interface)    (Adapter)
    ↓            ↓            ↓            ↓              ↓             ↓            ↓
  NestJS      Domain       Domain      Domain        Sportclub      Domain       Axios
```

## Características Implementadas

### Backend
- [x] Endpoints GET /api/beneficios y GET /api/beneficios/:id
- [x] Proxy/intermediario con API externa de Sportclub
- [x] Arquitectura Hexagonal (Ports & Adapters)
- [x] Domain-Driven Design (DDD)
- [x] Inversión de dependencias
- [x] Puertos driving y driven claramente separados
- [x] Adaptadores intercambiables
- [x] Manejo de errores (timeouts, datos corruptos, API caída)
- [x] Logging opcional (inyectado)
- [x] Validación y normalización de datos
- [x] Testing completo (35 tests, 100% coverage)
- [x] Global exception filter
- [x] Swagger/OpenAPI documentation
- [x] CORS configurado
- [x] Docker y Docker Compose

### Frontend
- [x] React 18 con TypeScript estricto
- [x] Vite como bundler
- [x] React Router (rutas: /beneficios, /beneficios/:id)
- [x] React Query para data fetching
- [x] Zustand para favorites con localStorage
- [x] Bootstrap 5 + React Bootstrap
- [x] Búsqueda y filtros en tiempo real
- [x] Sistema de favoritos persistente
- [x] Paginación (12 items por página)
- [x] Validación de vencimientos y estados
- [x] Testing completo (63 tests passing)
- [x] Docker y Docker Compose
- [x] Nginx para producción
- [x] Hot reload en desarrollo

## Manejo de Errores

El backend implementa un sistema robusto de manejo de errores:

### Excepciones Personalizadas
- `BeneficioNotFoundException`: Cuando un beneficio no existe (404)
- `ExternalApiException`: Problemas con la API externa (502)
- `DataValidationException`: Datos inválidos recibidos (422)

### Escenarios Manejados
1. **Timeout**: Tiempo de espera agotado (10 segundos)
2. **API Caída**: Sin respuesta de la API externa
3. **Datos Corruptos**: Validación y filtrado automático
4. **Errores de Red**: Reconexión y manejo graceful
5. **Errores Inesperados**: Logging detallado y respuesta estándar

## Logs

Los logs incluyen:
- Request/Response de HTTP
- Errores con stack trace completo
- Contexto del controlador y servicio
- Timestamp de cada operación
