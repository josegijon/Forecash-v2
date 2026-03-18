# ADR-001: Separar el dominio financiero en una librería independiente (`core/`)

---

## Contexto

Al empezar el proyecto, la alternativa más rápida era poner toda la lógica financiera directamente en los componentes React o en los stores de Zustand. Es el patrón más habitual en proyectos frontend de tamaño similar.

El problema es que mezclar lógica de negocio con lógica de presentación tiene un coste que se paga más tarde:

- Los cálculos financieros no se pueden testear sin montar componentes.
- Si se añade un backend o una CLI en el futuro, hay que extraer la lógica de entre el JSX.
- Es fácil que la lógica financiera acumule dependencias de React (`useState`, `useEffect`) que no le corresponden.

---

## Decisión

Separar todo el modelo financiero en un paquete TypeScript independiente: `core/`.

`core/` no importa React, no importa Zustand, no accede al DOM, no tiene efectos secundarios. Es una librería pura que el frontend consume como dependencia local de workspace.

El frontend importa desde `@core` (alias configurado en Vite):

```typescript
import { calculateMonthlySummary, validateCashflowItem } from "@core";
```

---

## Consecuencias

**Lo que se gana:**

- **Testeabilidad total.** Cualquier función del dominio se puede testear con un simple `node` o Jest, sin jsdom, sin mocks de React.
- **Límite explícito.** Si alguien intenta importar `useState` dentro de `core/`, TypeScript lo rechaza. El límite no es una convención, es una restricción técnica.
- **Portabilidad.** Si en el futuro se añade un servidor (Node.js) o una CLI, puede reutilizar `core/` sin modificarlo.
- **Legibilidad.** Un desarrollador nuevo puede entender el modelo financiero completo leyendo solo `core/`, sin navegar por componentes.

**El coste:**

- El build requiere compilar `core/` antes que el frontend (`npm run build -w core`).
- Añadir un concepto nuevo al dominio requiere editar dos paquetes si también tiene representación en la UI.

Se considera que el coste de build es asumible para un proyecto de este tamaño, y que la separación de responsabilidades justifica la fricción adicional.

---

## Alternativas descartadas

**Carpeta `src/domain/` dentro del frontend.**  
Más sencillo de arrancar, pero sin garantía técnica de que la lógica no acabe dependiendo de React. La separación en paquete distinto hace el límite explícito y comprobable por el compilador.

**Monolito con lógica en los stores.**  
Zustand es excelente para estado reactivo, pero no es el lugar correcto para definir qué es un `CashflowItem` válido o cómo se calcula el ahorro acumulado. Mezclar los dos roles haría los stores difíciles de razonar y de testear.