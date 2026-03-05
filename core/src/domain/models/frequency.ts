/**
 * Frecuencia de ocurrencia de un ítem de cashflow.
 *
 * - "once"       → ocurre una única vez en su startDate
 * - "monthly"    → ocurre todos los meses dentro del rango [startDate, endDate]
 * - "bimonthly"  → cada 2 meses (mismo paridad de mes que startDate)
 * - "quarterly"  → cada 3 meses
 * - "semiannual" → cada 6 meses
 * - "annual"     → una vez al año (mismo mes que startDate)
 *
 * Invariante: "once" NO debe tener endDate.
 */
export type Frequency =
    | "once"
    | "monthly"
    | "bimonthly"
    | "quarterly"
    | "semiannual"
    | "annual";

/** Frecuencias que admiten un rango [startDate, endDate] */
export const RANGED_FREQUENCIES: ReadonlySet<Frequency> = new Set([
    "monthly",
    "bimonthly",
    "quarterly",
    "semiannual",
    "annual",
]);