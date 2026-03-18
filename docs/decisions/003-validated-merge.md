# ADR-003: Validar la hidratación de `localStorage` con Zod

---

## Contexto

Los stores de Zustand persisten su estado en `localStorage` mediante el middleware `persist`. En cada carga de la aplicación, Zustand lee el JSON almacenado y lo mezcla (`merge`) con el estado inicial.

El problema: `localStorage` es mutable externamente. Un usuario puede editarlo, puede venir de una versión anterior de la app con un schema distinto, o puede estar corrupto por cualquier razón. Si Zustand carga ese JSON sin validarlo, el estado de la aplicación puede ser incoherente de formas difíciles de depurar.

Ejemplo concreto: la versión 1 del `scenarioStore` persiste `{ scenarios, activeScenarioId }`. Si en una versión futura se añade un campo obligatorio y un usuario tiene el schema antiguo en su `localStorage`, la app puede fallar silenciosamente con datos a medias.

---

## Decisión

Implementar un `createValidatedMerge` que reemplaza el merge por defecto de Zustand:

```typescript
// persist-validation.ts
export const createValidatedMerge = <T>(
    schema: ZodSchema,
    storeName: string,
) => (persistedState: unknown, currentState: T): T => {
    const result = schema.safeParse(persistedState);

    if (!result.success) {
        if (import.meta.env.DEV) {
            console.warn(`[${storeName}] Estado persistido inválido. Usando estado inicial.`, result.error);
        }
        return currentState;
    }

    return { ...currentState, ...result.data };
};
```

Cada store que persiste datos define su schema Zod y lo pasa al middleware:

```typescript
persist(
    (set) => ({ ... }),
    {
        name: "scenario-storage",
        version: 2,
        merge: createValidatedMerge<ScenarioState>(
            ScenarioPersistedSchema,
            "scenarioStore",
        ),
    },
)
```

---

## Consecuencias

**Lo que se gana:**

- Si el estado en `localStorage` no cumple el schema actual, se descarta y se usa el estado inicial. El usuario empieza limpio en lugar de tener una app rota.
- En desarrollo, se loguea un warning con el detalle del error de validación. En producción, falla silenciosamente de forma segura.
- El schema Zod actúa como documentación viva de qué se persiste y con qué tipos.
- Combinado con el campo `version` del middleware `persist` de Zustand, permite migraciones controladas entre versiones del schema.

**El coste:**

- Cada store que persiste necesita un schema Zod adicional en `schemas/store.schemas.ts`.
- Hay un pequeño coste de validación en cada carga inicial de la app. Es despreciable para los volúmenes de datos de este dominio.

---

## Alternativas descartadas

**Merge por defecto de Zustand (sin validación).**  
Funciona bien si el schema nunca cambia y el usuario nunca toca `localStorage`. En la práctica, ambas condiciones fallan tarde o temprano. El comportamiento ante datos inválidos es impredecible.

**Limpiar `localStorage` en cada despliegue.**  
Resuelve el problema de migraciones pero destruye los datos del usuario. Inaceptable para una app cuyo valor está precisamente en los datos que el usuario introduce.

**Versioning sin validación.**  
Zustand ofrece `migrate()` para transformar estados entre versiones. Es útil para migraciones conocidas, pero no protege contra corrupción arbitraria. Se puede combinar con la validación Zod para cubrir ambos casos.