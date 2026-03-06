/** Par año-mes que el dominio usa como unidad temporal mínima. */
export interface YearMonth {
    readonly year: number;
    readonly month: number; // 0-indexed (0 = Enero, 11 = Diciembre)
}

/**
 * Parsea una fecha ISO "YYYY-MM-DD" como UTC puro,
 * evitando el problema de timezone con `new Date(string)`.
 * Devuelve { year, month (0-indexed), day }.
 *
 * @throws si el formato no es YYYY-MM-DD o los componentes no son numéricos.
 */
export const parseISODate = (iso: string): { year: number; month: number; day: number } => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
        throw new Error(`parseISODate: formato inválido "${iso}". Se esperaba YYYY-MM-DD.`);
    }
    const [year, month, day] = iso.split("-").map(Number);
    return { year, month: month - 1, day };
};

/**
 * Añade N meses a un { year, month }, normalizando siempre al primer
 * día del mes para evitar overflows de fin de mes.
 *
 * Soporta n negativo (retrocede meses).
 * Ejemplo: addMonths({ year: 2025, month: 0 }, -1) → { year: 2024, month: 11 }
 */
export const addMonths = (ym: YearMonth, n: number): YearMonth => {
    const totalMonths = ym.year * 12 + ym.month + n;
    return {
        year: Math.floor(totalMonths / 12),
        month: ((totalMonths % 12) + 12) % 12, // protege contra módulo negativo en JS
    };
};

/**
 * Formatea un YearMonth como "YYYY-MM-DD" usando siempre el primer día del mes.
 */
export const toISOFirstOfMonth = ({ year, month }: YearMonth): string => {
    const mm = String(month + 1).padStart(2, "0");
    return `${year}-${mm}-01`;
};

/**
 * Diferencia en meses entre dos puntos temporales.
 * Positivo si end > start, negativo si end < start.
 */
export const monthDiff = (start: YearMonth, end: YearMonth): number => {
    return (end.year - start.year) * 12 + (end.month - start.month);
};