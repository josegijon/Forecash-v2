# Forecash

**Planificador financiero personal y proyector de cashflow.**

Forecash no es un dashboard de métricas ni una app de contabilidad. Es una herramienta de planificación y toma de decisiones que ayuda a responder preguntas reales:

> *"¿Llego a fin de mes dentro de 6 meses si acepto este trabajo?"*
> *"¿Cuánto margen real tengo si me mudo?"*
> *"¿Qué variable me está hundiendo el plan?"*

→ [Ver demo en producción](https://forecash-app.vercel.app)

---

## ¿Qué hace?

- Define tu situación financiera: ingresos, gastos fijos, gastos variables y ahorro.
- Proyecta tu cashflow mes a mes hasta 5 años vista.
- Crea escenarios alternativos ("¿qué pasa si...?") y los compara lado a lado.
- Identifica visualmente los meses en negativo, los picos de gasto y los puntos de riesgo.
- Funciona sin cuenta. Los datos viven en `localStorage` del navegador.

---

## Stack

| Capa | Tecnología |
|---|---|
| Dominio | TypeScript puro (sin dependencias de UI) |
| Frontend | React 19 + Vite + React Router 7 |
| Estado | Zustand 5 con persistencia validada (Zod) |
| Estilos | Tailwind CSS 4 |
| Gráficas | Recharts |
| Despliegue | Vercel |

---

## Estructura del repositorio

```
forecash/
├── core/          # Librería de dominio pura (sin React, sin efectos)
│   └── src/
│       ├── domain/        # Modelos, reglas e invariantes
│       ├── application/   # Casos de uso
│       └── shared/        # Utilidades y constantes
├── frontend/      # Aplicación React
│   └── src/
│       ├── pages/         # Vistas principales
│       ├── store/         # Estado global (Zustand)
│       ├── ui/            # Componentes, hooks, layout
│       ├── schemas/       # Validación de persistencia (Zod)
│       └── routes/        # Definición de rutas
└── docs/          # Documentación técnica
```

El monorepo usa **npm workspaces**. `core` se compila a TypeScript y el frontend lo consume como dependencia local.

---

## Documentación

| Documento | Descripción |
|---|---|
| [Arquitectura](./docs/architecture.md) | Estructura del sistema y flujo de datos |
| [Modelo de dominio](./docs/domain.md) | Entidades, reglas e invariantes del core |
| [Estado global](./docs/stores.md) | Stores de Zustand y estrategia de persistencia |
| [Rutas](./docs/routing.md) | Navegación y estructura de URLs |
| [Cómo arrancar](./docs/getting-started.md) | Guía para desarrolladores |
| [Decisiones técnicas](./docs/decisions/) | ADRs: por qué se tomó cada decisión clave |

---

## Arranque rápido

```bash
# Instalar dependencias (workspace raíz)
npm install

# Compilar el core (necesario la primera vez)
npm run build -w core

# Arrancar el frontend en desarrollo
cd frontend && npm run dev
```

Requisitos: Node.js ≥ 18.

---

## Principios de diseño

**El dominio no conoce React.** Todo el modelo financiero vive en `core/`, una librería TypeScript sin dependencias de UI. Puede testearse, reutilizarse o portarse a otro frontend sin tocar una línea de lógica.

**Los datos del usuario son suyos.** No hay backend, no hay cuenta, no hay telemetría de datos personales. Todo vive en `localStorage`. El usuario puede exportar e importar su estado como JSON en cualquier momento.

**Fail-fast con mensajes útiles.** Las invariantes de dominio se validan explícitamente. Los stores rechazan datos inválidos antes de persistirlos. La hidratación de `localStorage` se valida con Zod para no corromper el estado ante cambios de schema.