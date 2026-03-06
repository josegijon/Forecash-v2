import { CashflowItem } from "../../domain/models/cashflow-items";
import { calculateAccumulatedSavings } from "../../domain/services/monthly-calculator";
import { addMonths } from "../../shared/utils/date-utils";

export interface BalanceSeriesPoint {
    year: number;
    month: number; // 0-indexed
    balance: number;
}

export interface ProjectBalanceSeriesInput {
    items: CashflowItem[];
    initialBalance: number;
    referenceYear: number;
    referenceMonth: number; // 0-indexed
    /** Número de meses a proyectar desde el mes de referencia (inclusive). */
    horizonMonths: number;
}

/**
 * Genera una serie temporal de balances acumulados mes a mes.
 *
 * Caso de uso puro: no depende de React ni de Zustand.
 * Produce un punto por cada mes desde referenceMonth hasta referenceMonth + horizonMonths.
 */
export const projectBalanceSeries = ({
    items,
    initialBalance,
    referenceYear,
    referenceMonth,
    horizonMonths,
}: ProjectBalanceSeriesInput): BalanceSeriesPoint[] => {
    const points: BalanceSeriesPoint[] = [];

    for (let i = 0; i <= horizonMonths; i++) {
        const { year, month } = addMonths(
            { year: referenceYear, month: referenceMonth },
            i,
        );

        const balance = calculateAccumulatedSavings(
            items,
            initialBalance,
            referenceYear,
            referenceMonth,
            year,
            month,
        );

        points.push({ year, month, balance });
    }

    return points;
};