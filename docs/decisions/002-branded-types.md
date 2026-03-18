# ADR-002: Usar branded types para fechas (`ISODateString`)

---

## Contexto

El dominio financiero trabaja con fechas a precisión de día: cuándo empieza un ítem, cuándo termina, desde qué mes se acumula el ahorro. Estas fechas se almacenan y comparan como strings con formato `YYYY-MM-DD`.

TypeScript representa estos valores como `string`. Eso significa que el compilador no distingue entre:

```typescript
const fecha = "2025-01-15";           // ISODateString legítima
const nombre = "Alquiler mensual";    // string arbitrario
const rota = "15/01/2025";            // formato incorrecto
```

Los tres son `string` para TypeScript. Una función que espera una fecha puede recibir cualquiera de ellos sin advertencia.

---

## Decisión

Usar un **branded type** para representar fechas del dominio:

```typescript
type ISODateString = string & { readonly __brand: 'ISODateString' };
```

Un branded type es un `string` normal en runtime, pero TypeScript lo trata como un tipo distinto. El compilador rechaza pasar un `string` plano donde se espera una `ISODateString`.

La única forma de construir una `ISODateString` es mediante `toISODateString()`, que valida el formato:

```typescript
export const toISODateString = (value: string): ISODateString => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`Fecha inválida: "${value}". Se esperaba formato YYYY-MM-DD.`);
    }
    return value as ISODateString;
};
```

---

## Por qué no `Date`

`Date` introduciría ambigüedad de timezone que este dominio no necesita. Las fechas aquí son meses contables, no instantes en el tiempo. Un alquiler que empieza el "2025-01-01" no tiene zona horaria relevante — es simplemente "enero de 2025".

`Date` también hace el código más verboso (construcción, serialización, comparación) sin aportar nada útil para este caso de uso.

---

## Consecuencias

**Lo que se gana:**

- El compilador detecta en tiempo de build si se pasa un `string` arbitrario a una función que espera una fecha.
- La validación del formato ocurre en un único punto (`toISODateString`), no dispersa por el código.
- Las comparaciones de fechas funcionan directamente con `<`, `>` y `===` porque el formato lexicográfico de `YYYY-MM-DD` es consistente con el orden cronológico.

**El coste:**

- Requiere usar `toISODateString()` al construir cualquier fecha. Es fricción mínima y controlada.
- Los valores que vienen de `localStorage` o de una importación JSON necesitan pasar por `toISODateString()` para recuperar el tipo. Esto se hace en el caso de uso `import-snapshot` y en la validación de persistencia.

---

## Alternativas descartadas

**`string` plano con convención de naming.**  
`startDateIso: string` comunica la intención pero no la garantiza. El compilador no ayuda. Un error de formato llega en runtime.

**Clase `LocalDate` o similar.**  
Más expresivo, pero añade overhead de serialización/deserialización y complejidad innecesaria para un dominio donde las fechas son siempre strings en persistencia.