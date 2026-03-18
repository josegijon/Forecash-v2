# Estado global

El frontend gestiona el estado con **Zustand 5**. Cuatro stores independientes, cada uno con una responsabilidad única y bien delimitada.

---

## Por qué Zustand

Zustand ofrece estado global reactivo sin la ceremonia de Redux (actions, reducers, dispatch) y sin los problemas de re-renders de Context. Para este proyecto, donde el estado es relativamente plano y las actualizaciones son directas, es la elección más pragmática.

Los stores no contienen lógica financiera. Su responsabilidad es transportar y persistir datos, no calcularlos. Toda la lógica vive en `core/`.

---

## Stores

### `scenarioStore`

Gestiona los escenarios de planificación: su ciclo de vida completo y el escenario activo.

**Estado persistido:**
```typescript
{
  scenarios: Scenario[];        // Mínimo uno siempre
  activeScenarioId: string;
}
```

**Operaciones:**
- `addScenario(name)` → crea con valores por defecto, devuelve el nuevo `id`.
- `removeScenario(id)` → rechaza si es el único escenario. Reasigna el activo si se elimina el actual. Devuelve el nuevo `activeScenarioId`.
- `duplicateScenario(id)` → crea una copia con nuevo `id` y nombre `"X (copia)"`. Devuelve el nuevo `id` para que el llamador pueda duplicar también los ítems.
- `setInitialBalance / setSavingsGoal / setCushionBalance / setCapitalGoal` → actualizan campos individuales con guardas de validación (`isFinite`, `>= 0`).

**Decisión de diseño:** `removeScenario` devuelve el nuevo `activeScenarioId` (o `null` si no se puede eliminar) en lugar de que el llamador tenga que leerlo del store después. Esto permite que el componente que llama sepa a qué escenario redirigir en una sola operación.

**Schema de validación (Zod):**
```typescript
z.object({
  scenarios: z.array(PersistedScenarioSchema).min(1),
  activeScenarioId: z.string().min(1),
})
```
El `.min(1)` en el array garantiza que nunca se hidrata un estado sin escenarios.

---

### `cashflowStore`

Almacena los ítems de cashflow de todos los escenarios, indexados por `scenarioId`.

**Estado persistido:**
```typescript
{
  items: Record<string, CashflowItem[]>;  // key: scenarioId
}
```

**Operaciones:**
- `addItem(item)` → valida las invariantes de dominio antes de persistir. Si hay violaciones, rechaza la operación (loguea en DEV).
- `updateItem(id, scenarioId, changes)` → actualiza campos editables de un ítem existente.
- `removeItem(id, scenarioId)` → elimina un ítem concreto.
- `removeAllByScenario(scenarioId)` → limpia todos los ítems de un escenario. Se llama al eliminar el escenario.
- `duplicateScenarioItems(sourceId, targetId)` → copia todos los ítems de un escenario a otro, generando nuevos `id` para cada uno.

**Validación en `addItem`:**

```typescript
addItem: (item) => {
    const violations = validateCashflowItem(item);  // ← regla de dominio en core/
    if (violations.length > 0) {
        if (import.meta.env.DEV) console.error(...);
        return;
    }
    // persiste...
}
```

El store es la última línea de defensa antes de persistir. La UI puede hacer su propia validación para feedback inmediato al usuario, pero el store valida independientemente.

**Selectores:**
```typescript
useScenarioItems(scenarioId)    // todos los ítems del escenario
useScenarioIncomes(scenarioId)  // solo ingresos
useScenarioExpenses(scenarioId) // solo gastos
```

Los selectores reciben `scenarioId` como parámetro y son estables: devuelven el mismo array vacío (`EMPTY_ITEMS`) cuando no hay datos, evitando re-renders por referencia nueva.

---

### `planningStore`

Gestiona el mes activo en la vista de planificación. No persiste — se resetea al mes actual en cada carga.

**Estado:**
```typescript
{
  activeMonth: number;  // 0-indexed (0 = enero)
  activeYear: number;
}
```

**Operaciones:**
- `goForward()` / `goBack()` — navegan mes a mes con límites en años 1900–2200.
- `goToToday()` — resetea al mes y año actuales.

Es el store más simple. Su única responsabilidad es saber qué mes está mirando el usuario en la pantalla de planificación.

---

### `settingsStore`

Preferencias globales del usuario.

**Estado persistido:**
```typescript
{
  currency: "EUR" | "USD" | "GBP";
  theme: "light" | "dark";
}
```

Las mutaciones validan contra conjuntos de valores permitidos (`VALID_CURRENCIES`, `VALID_THEMES`) antes de aplicar el cambio. Un valor desconocido que llegue de `localStorage` se descarta en el merge Zod y se usa el default.

**Selector:**
```typescript
useCurrencySymbol()  // devuelve "€" | "$" | "£"
```

---

## Persistencia y validación

Los stores que persisten (`scenario`, `cashflow`, `settings`) usan el middleware `persist` de Zustand con un merge personalizado:

```typescript
persist(storeImpl, {
    name: "scenario-storage",
    version: 2,
    partialize: (state) => ({ scenarios: state.scenarios, activeScenarioId: state.activeScenarioId }),
    merge: createValidatedMerge<ScenarioState>(ScenarioPersistedSchema, "scenarioStore"),
})
```

**`createValidatedMerge`** reemplaza el merge por defecto:

1. Si el valor de `localStorage` es `null` o `undefined` → usa el estado inicial.
2. Parsea con Zod (`safeParse`).
3. Si el schema no coincide → descarta los datos, usa el estado inicial, loguea en DEV.
4. Si es válido → mezcla sobre el estado inicial (`{ ...currentState, ...result.data }`).

El paso 4 mezcla sobre el estado inicial, no reemplaza. Esto significa que si se añade un campo nuevo al store, tendrá su valor por defecto aunque el `localStorage` sea de una versión anterior que no lo incluía.

**`partialize`** controla qué parte del estado se persiste. Las acciones (funciones) nunca se serializan.

Los schemas Zod en `schemas/store.schemas.ts` replican las invariantes del dominio:

```typescript
// El schema Zod garantiza las mismas restricciones que las reglas de dominio
amount: z.number().positive().finite(),   // == AMOUNT_MUST_BE_POSITIVE
savingsGoal: z.number().min(0).finite(),  // == invariante de Scenario
scenarios: z.array(...).min(1),           // siempre hay al menos un escenario
```

Esto crea una doble capa: el dominio valida al escribir, Zod valida al leer de persistencia.

---

## Flujo de duplicación de escenario

Duplicar un escenario implica coordinar dos stores. Esta coordinación ocurre en el componente o caso de uso que inicia la acción, no dentro de los stores:

```
1. scenarioStore.duplicateScenario(sourceId)
      → crea nuevo Scenario con nuevo id
      → devuelve newScenarioId

2. cashflowStore.duplicateScenarioItems(sourceId, newScenarioId)
      → copia los ítems con nuevos ids y el nuevo scenarioId

3. scenarioStore.setActiveScenario(newScenarioId)
      → activa el escenario recién creado
```

Los stores no se conocen entre sí. La coordinación es responsabilidad del llamador.