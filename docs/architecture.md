# Arquitectura

## Visión general

Forecash separa de forma estricta el **modelo financiero** de la **interfaz de usuario**. Esta separación no es cosmética: el núcleo del sistema (`core/`) es una librería TypeScript independiente que no importa React, no lee el DOM y no tiene efectos secundarios. El frontend consume `core/` como cualquier otra dependencia.

```
┌─────────────────────────────────────────────────────┐
│                    frontend/                         │
│                                                     │
│   ┌──────────┐   ┌──────────┐   ┌───────────────┐  │
│   │  pages/  │   │  store/  │   │  ui/components│  │
│   │ (vistas) │◄──│ (Zustand)│◄──│   (React)     │  │
│   └────┬─────┘   └────┬─────┘   └───────────────┘  │
│        │              │                              │
│        └──────┬───────┘                              │
│               ▼                                     │
│         import from @core                           │
└───────────────┬─────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────┐
│                      core/                           │
│                                                     │
│   ┌──────────────┐  ┌──────────────┐               │
│   │   domain/    │  │ application/ │               │
│   │  models      │  │  use-cases   │               │
│   │  rules       │◄─│              │               │
│   │  services    │  └──────────────┘               │
│   └──────────────┘                                  │
└─────────────────────────────────────────────────────┘
```

---

## Capa de dominio (`core/src/domain/`)

Contiene la lógica financiera pura. Tres subcarpetas con responsabilidades distintas:

### `models/`

Define las **entidades y tipos** del dominio. Sin lógica de negocio, solo estructura y contratos:

- `CashflowItem` — Un ítem de ingreso o gasto con frecuencia, fechas y categoría.
- `Scenario` — Un conjunto de parámetros financieros (saldo inicial, objetivo de ahorro, colchón).
- `MonthlySummary` — El resultado calculado para un mes concreto: ingresos, gastos, ratios.
- `Frequency` — Los posibles ciclos de recurrencia (`monthly`, `quarterly`, `annual`…).
- `ISODateString` — Branded type para fechas. Impide usar un `string` arbitrario donde se espera una fecha válida.

### `rules/`

**Invariantes y restricciones** del dominio. Funciones puras que validan o determinan comportamiento:

- `cashflow-invariants.ts` — Valida un `CashflowItem` antes de persistirlo. Devuelve un array de violation codes (`AMOUNT_MUST_BE_POSITIVE`, `END_DATE_BEFORE_START_DATE`…) en lugar de lanzar excepciones directamente. El llamador decide cómo manejarlos.
- `occurrence.ts` — `isActiveMonth()`: dada una frecuencia y un rango de fechas, determina si un ítem tiene ocurrencia en un mes concreto. Lógica de módulo sobre distancia en meses.
- `cushion.ts` — Calcula el colchón de emergencia recomendado según perfil laboral, dependientes y aversión al riesgo.

### `services/`

**Cálculos que operan sobre colecciones** de entidades:

- `monthly-calculator.ts` — Calcula ingresos, gastos, balance neto y ahorro acumulado para un mes dado. El ahorro acumulado itera desde el mes de referencia hasta el mes objetivo: O(meses × ítems), aceptable para horizontes ≤ 60 meses.

---

## Capa de aplicación (`core/src/application/use-cases/`)

Orquesta el dominio para responder a intenciones concretas del usuario. Cada caso de uso es una función pura que combina servicios y reglas del dominio:

| Caso de uso | Responsabilidad |
|---|---|
| `create-planned-cashflow-item` | Construye y valida un nuevo ítem antes de devolverlo al store |
| `project-balance-series` | Genera la serie temporal de balance acumulado para un horizonte dado |
| `detect-balance-crosses` | Detecta cuándo el balance cruza el colchón o entra en negativo |
| `import-snapshot` | Valida y normaliza un JSON externo antes de cargarlo en el estado |

---

## Estado global (`frontend/src/store/`)

El frontend gestiona el estado con **Zustand**. Cuatro stores independientes, cada uno con una responsabilidad clara:

| Store | Responsabilidad |
|---|---|
| `scenarioStore` | Escenarios (CRUD), escenario activo, parámetros financieros |
| `cashflowStore` | Ítems de cashflow, indexados por `scenarioId` |
| `planningStore` | Mes activo en la vista de planificación (navegación temporal) |
| `settingsStore` | Preferencias de usuario: moneda y tema |

Los stores que persisten datos (`scenario`, `cashflow`, `settings`) usan un **merge validado con Zod** en la hidratación. Si el schema de `localStorage` no coincide con el schema actual (por ejemplo, tras una actualización), el estado corrupto se descarta en lugar de propagarse silenciosamente. Ver [ADR-003](./decisions/003-validated-merge.md).

---

## Rutas

Las rutas tienen la forma `/escenario/:id/<vista>`. El escenario activo vive en la URL, no solo en el store. Esto permite cambiar de escenario navegando directamente o compartiendo una URL concreta.

```
/                                    → redirect → /escenario/scenario-1/planificacion
/escenario/:id/planificacion         → PlanningPage
/escenario/:id/simulaciones          → SimulationPage
/escenario/:id/proyeccion            → ProjectionPage
/escenario/:id/datos                 → DataPage
*                                    → redirect → /escenario/scenario-1/planificacion
```

Cada página se carga como chunk independiente (`React.lazy`). Vite solo descarga el código cuando el usuario navega a esa ruta.

---

## Flujo de datos

Un ejemplo end-to-end: el usuario añade un gasto de alquiler mensual.

```
Usuario rellena el modal
        │
        ▼
AddCashflowModal
  llama a createPlannedCashflowItem()   ← caso de uso en core/
        │ devuelve NewCashflowItem validado
        ▼
cashflowStore.addItem()
  llama a validateCashflowItem()        ← regla de dominio en core/
  si válido → persiste en state + localStorage
        │
        ▼
useScenarioItems(scenarioId)            ← selector reactivo
  notifica a los componentes suscritos
        │
        ▼
ProjectionPage / PlanningPage
  llama a calculateMonthlySummary()     ← servicio en core/
  renderiza los resultados
```

La lógica financiera nunca vive en los componentes ni en los stores. Los stores son transporte y persistencia. Los componentes son presentación.

---

## Despliegue

El proyecto se despliega en **Vercel**. El `vercel.json` redirige todas las rutas a `index.html` para que React Router gestione la navegación client-side (SPA).

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

El build compila primero `core/` (genera `dist/`) y después construye el frontend que lo consume.