# Cómo arrancar

## Requisitos

- Node.js ≥ 18
- npm ≥ 9 (incluido con Node 18)

No hay backend. No hay base de datos. No hay variables de entorno obligatorias.

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/josegijon/Forecash-v2.git
cd forecash

# Instalar dependencias de todos los workspaces
npm install
```

---

## Desarrollo

El proyecto usa **npm workspaces**. `core/` debe compilarse antes de que el frontend pueda importarlo.

```bash
# 1. Compilar el core (genera core/dist/)
npm run build -w core

# 2. Arrancar el frontend en modo desarrollo
cd frontend
npm run dev
```

La app estará disponible en `http://localhost:5173`.

En desarrollo, `core/` puede compilarse en modo watch para que los cambios se reflejen automáticamente:

```bash
# Terminal 1 — watch del core
cd core && npm run dev

# Terminal 2 — dev server del frontend
cd frontend && npm run dev
```

---

## Build de producción

```bash
# Desde la raíz — compila core/ y después el frontend
npm run build
```

El script raíz ejecuta en orden:
1. `npm run build -w core` → genera `core/dist/`
2. `cd frontend && npm install && npm run build` → genera `frontend/dist/`

El contenido de `frontend/dist/` es el artefacto desplegable.

---

## Estructura de workspaces

```
forecash/           ← workspace raíz (package.json con workspaces)
├── core/           ← librería TypeScript pura
│   ├── src/
│   └── dist/       ← generado por tsc, no commitear
└── frontend/       ← aplicación React + Vite
    ├── src/
    └── dist/       ← generado por vite build, no commitear
```

El frontend importa `core/` mediante el alias `@core`, configurado en `vite.config.ts`. En runtime, apunta a `core/dist/index.js`.

---

## Convenciones del proyecto

**Lógica financiera → `core/`.**  
Si escribes un cálculo que involucre `CashflowItem`, `Scenario` o `MonthlySummary`, pertenece a `core/`. No al store, no al componente.

**Los stores no calculan, transportan.**  
Un store puede llamar a funciones de `core/` para validar antes de persistir, pero no debe contener lógica de negocio propia.

**Validar invariantes en el store, no solo en la UI.**  
La UI puede validar para dar feedback inmediato, pero el store es la última barrera antes de persistir. Usa `validateCashflowItem()` en `addItem`.

**Ratios como fracción, no como porcentaje.**  
`savingsRate = 0.42`, no `42`. La capa de presentación multiplica por 100. Así el dominio no acumula responsabilidades de formato.