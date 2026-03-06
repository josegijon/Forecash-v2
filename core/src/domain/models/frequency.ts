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

/**
 * Intervalo en meses entre ocurrencias para frecuencias cíclicas.
 * `"once"` devuelve `null` porque no tiene intervalo de repetición:
 * usarlo en lógica modular es un error de categoría.
 *
 * Esta es una regla de dominio pura — la fuente de verdad del intervalo
 * de cada frecuencia. `frequencyMonthsMap` en shared/ es un alias de presentación
 * que debe derivar de aquí.
 */
export const getFrequencyInterval = (frequency: Frequency): number | null => {
    switch (frequency) {
        case "once": return null;
        case "monthly": return 1;
        case "bimonthly": return 2;
        case "quarterly": return 3;
        case "semiannual": return 6;
        case "annual": return 12;
    }
};