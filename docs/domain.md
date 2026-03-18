# Modelo de dominio

El dominio de Forecash modela la planificación financiera personal: qué entra, qué sale, con qué frecuencia, y cómo evoluciona el balance a lo largo del tiempo.

Todo el dominio vive en `core/src/domain/`. No importa React. No tiene efectos secundarios. Es testeable de forma aislada.

---

## Entidades

### `CashflowItem`

La unidad básica del modelo. Representa un ingreso o gasto planificado.

```typescript
interface CashflowItem {
  id: string;
  scenarioId: string;
  type: "income" | "expense";
  name: string;
  amount: number;          // Siempre positivo. El signo lo da `type`.
  categoryId: string;
  frequency: Frequency;
  startDate: ISODateString;
  endDate?: ISODateString; // No existe si frequency === "once"
}
```

**Decisiones de diseño:**

- `amount` es siempre positivo. El signo semántico lo aporta `type`. Esto elimina ambigüedad: un gasto de 500 € es `{ type: "expense", amount: 500 }`, nunca `{ amount: -500 }`.
- `endDate` es opcional porque un gasto recurrente indefinido (ej: alquiler) no tiene fecha de fin conocida. La ausencia de `endDate` significa "sin límite", no "un mes".
- `startDate` y `endDate` usan `ISODateString` (ver más abajo), no `Date` ni `string` plano.

**Invariantes** (validadas por `cashflow-invariants.ts`):

| Invariante | Violation code |
|---|---|
| `amount > 0` | `AMOUNT_MUST_BE_POSITIVE` |
| `name` no vacío | `EMPTY_NAME` |
| `categoryId` no vacío | `EMPTY_CATEGORY_ID` |
| `frequency === "once"` no puede tener `endDate` | `ONCE_CANNOT_HAVE_END_DATE` |
| `endDate >= startDate` si existe | `END_DATE_BEFORE_START_DATE` |

---

### `Scenario`

Un conjunto de parámetros financieros que define el punto de partida de una proyección.

```typescript
interface Scenario {
  id: string;
  name: string;
  initialBalance: number;   // Puede ser negativo (deuda inicial)
  savingsGoal: number;      // >= 0
  cushionBalance: number;   // >= 0
  capitalGoal?: number;     // >= 0, opcional
}
```

Un escenario no contiene ítems de cashflow directamente. Los ítems referencian al escenario por `scenarioId`. Esta separación permite duplicar un escenario (y sus ítems) de forma independiente, y mantener el estado en stores distintos sin acoplamiento.

---

### `MonthlySummary`

El resultado del cálculo financiero para un mes concreto. Es un valor derivado — nunca se persiste, siempre se recalcula.

```typescript
interface MonthlySummary {
  year: number;
  month: number;            // 0-indexed (0 = enero)
  totalIncome: number;
  totalExpense: number;
  netBalance: number;       // totalIncome - totalExpense
  accumulatedSavings: number;
  savingsRate: number;      // ∈ [0, 1]
  expenseRate: number;      // ∈ [0, ∞)
  progressGoal: number;     // ∈ [0, 1]
}
```

Los ratios (`savingsRate`, `expenseRate`, `progressGoal`) se expresan como fracción, no como porcentaje. La capa de presentación multiplica por 100 si necesita mostrarlo como "42 %". Esta separación evita que la lógica de dominio acumule responsabilidades de formato.

---

## Tipos de valor

### `ISODateString`

```typescript
type ISODateString = string & { readonly __brand: 'ISODateString' };
```

Un **branded type**: un `string` que TypeScript trata como tipo distinto a `string`. El compilador rechaza pasar un `string` arbitrario donde se espera una `ISODateString`. Solo se puede construir con `toISODateString()`, que valida el formato `YYYY-MM-DD`.

El dominio trabaja con fechas a precisión de día (sin hora ni zona horaria). Usar `Date` introduciría ambigüedad de timezone innecesaria para este dominio.

---

### `Frequency`

```typescript
type Frequency =
  | "once"
  | "monthly"
  | "bimonthly"
  | "quarterly"
  | "semiannual"
  | "annual";
```

`getFrequencyInterval(frequency)` devuelve el intervalo en meses entre ocurrencias, o `null` para `"once"`. Esta función es la **fuente de verdad** del intervalo de cada frecuencia. Cualquier otro lugar del código que necesite este dato debe derivarlo de aquí, no duplicarlo.

---

## Reglas de dominio

### Validación de invariantes (`cashflow-invariants.ts`)

```typescript
const validateCashflowItem = (item: Omit<CashflowItem, "id">): InvariantViolation[]
```

Devuelve un array de violation codes, no lanza. El llamador (el store, el caso de uso) decide cómo reaccionar. Esto permite:

- En el store: descartar silenciosamente en producción, loguear en desarrollo.
- En tests: verificar qué violaciones produce un input concreto.
- En la UI: mostrar mensajes específicos por campo sin parsear mensajes de error.

`assertCashflowItemValid()` es un wrapper que sí lanza, para contextos donde un fallo es irrecuperable.

---

### Ocurrencia mensual (`occurrence.ts`)

```typescript
const isActiveMonth = ({ item, year, month }: IsActiveMonthProps): boolean
```

Determina si un `CashflowItem` tiene una ocurrencia en el mes `(year, month)`.

**Algoritmo:**

1. Si el mes consultado es anterior a `startDate` → `false`.
2. Si el mes consultado es posterior a `endDate` → `false`.
3. Calcula `monthsElapsed = monthDiff(startDate, targetMonth)`.
4. Aplica la regla de frecuencia:

```
"once"      → monthsElapsed === 0
"monthly"   → true (siempre dentro del rango)
"bimonthly" → monthsElapsed % 2 === 0
"quarterly" → monthsElapsed % 3 === 0
"semiannual"→ monthsElapsed % 6 === 0
"annual"    → monthsElapsed % 12 === 0
```

La frecuencia se expresa como módulo sobre la distancia real en meses desde `startDate`, no sobre el número de mes del año. Un ítem trimestral que empieza en febrero ocurre en febrero, mayo, agosto y noviembre — no en marzo, junio, septiembre y diciembre.

---

### Colchón de emergencia (`cushion.ts`)

Calcula el número de meses de gastos fijos que debería cubrir el colchón de seguridad, según tres factores:

| Factor | Opciones | Meses base |
|---|---|---|
| Perfil laboral | Funcionario / Empleado / Autónomo | 3 / 4 / 8 |
| Dependientes | Sí / No | +2 / +0 |
| Deuda con cuota fija | Sí / No | +1 / +0 |

El total se multiplica por un factor de riesgo (`0.85` / `1.0` / `1.25`) y se redondea al múltiplo de 0.5 más cercano (granularidad de medio mes).

Devuelve un `CushionResult` con el total y un `breakdown` paso a paso, que la UI usa para explicar el cálculo al usuario en lugar de mostrar solo el número final.

---

## Servicio de cálculo mensual (`monthly-calculator.ts`)

El servicio central del dominio. Expone funciones puras que operan sobre una lista de `CashflowItem`:

```
calculateMonthlyIncome(items, year, month)    → number
calculateMonthlyExpenses(items, year, month)  → number
calculateNetBalance(items, year, month)       → number

calculateAccumulatedSavings(
  items, initialBalance,
  referenceYear, referenceMonth,
  targetYear, targetMonth
) → number

calculateMonthlySummary({
  items, year, month,
  initialBalance, savingsGoal,
  referenceYear, referenceMonth
}) → MonthlySummary
```

**`calculateAccumulatedSavings`** itera mes a mes desde el mes de referencia hasta el mes objetivo, sumando el `netBalance` de cada mes. Complejidad O(meses × ítems). Para horizontes de hasta 60 meses (5 años) con decenas de ítems, el coste es despreciable. Si el horizonte o el número de ítems creciera significativamente, sería candidato a memoización.

El mes de referencia es el mes desde el que el usuario quiere empezar a acumular (normalmente el mes actual). El `initialBalance` es el saldo del que parte, que puede ser negativo (deuda).