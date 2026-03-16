import type { Frequency } from "../../domain/models/frequency";
import { getFrequencyInterval } from "../../domain/models/frequency";

/**
 * Mapa de frecuencia → intervalo en meses.
 *
 * Derivado de `getFrequencyInterval` para garantizar consistencia con el dominio.
 * Tipado como `Record<Frequency, number | null>` para forzar exhaustividad:
 * si se añade una nueva Frequency, TypeScript exigirá actualizarlo.
 *
 * ⚠️ `"once"` es `null` — no tiene intervalo de repetición.
 * Usar este valor en operaciones modulares es un error de categoría.
 *
 * Uso previsto: capa de presentación (labels, sliders, selects).
 * La lógica de ocurrencia usa `getFrequencyInterval` directamente.
 */
export const frequencyMonthsMap: Record<Frequency, number | null> = {
    once: getFrequencyInterval("once"),       // null
    monthly: getFrequencyInterval("monthly"),    // 1
    bimonthly: getFrequencyInterval("bimonthly"),  // 2
    quarterly: getFrequencyInterval("quarterly"),  // 3
    semiannual: getFrequencyInterval("semiannual"), // 6
    annual: getFrequencyInterval("annual"),     // 12
};