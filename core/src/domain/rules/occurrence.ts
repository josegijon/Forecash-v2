import type { CashflowItem } from "@core/index";
import { parseISODate, monthDiff } from "@core/index";

interface IsActiveMonthProps {
    item: CashflowItem;
    year: number;
    month: number; // 0-indexed
}

/**
 * Determina si un CashflowItem tiene una ocurrencia en el mes (year, month) dado.
 *
 * Reglas:
 * - El mes debe estar dentro del rango [startDate, endDate] (si endDate existe).
 * - La frecuencia determina si el mes concreto tiene ocurrencia dentro del rango.
 * - Las frecuencias cíclicas se basan en la distancia real de meses desde startDate.
 */
export const isActiveMonth = ({ item, year, month }: IsActiveMonthProps): boolean => {
    const start = parseISODate(item.startDate);
    const target = { year, month };

    // ── Guardia: el mes consultado es anterior al inicio ──
    if (monthDiff(start, target) < 0) return false;

    // ── Guardia: el mes consultado es posterior al fin ──
    if (item.endDate) {
        const end = parseISODate(item.endDate);
        if (monthDiff(end, target) > 0) return false;
    }

    // ── Distancia real en meses desde el inicio ──
    const monthsElapsed = monthDiff(start, target);

    switch (item.frequency) {
        case "once": return monthsElapsed === 0;
        case "monthly": return true;
        case "bimonthly": return monthsElapsed % 2 === 0;
        case "quarterly": return monthsElapsed % 3 === 0;
        case "semiannual": return monthsElapsed % 6 === 0;
        case "annual": return monthsElapsed % 12 === 0;
        default: return false;
    }
};