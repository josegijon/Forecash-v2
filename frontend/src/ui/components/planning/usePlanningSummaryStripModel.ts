import { useMemo } from "react";

import { calculateMonthlySummary } from "@core";

import { useActiveScenario, useCurrencySymbol, usePlanningStore, useScenarioItems, useScenarioStore } from "@/store";

export interface TrendValue {
    value: string;
    positive: boolean;
}

export interface PlanningSummaryStripModel {
    totalIncome: string;
    totalExpense: string;
    netBalance: string;
    accumulatedSavings: string;
    incomeTrend?: TrendValue;
    expenseTrend?: TrendValue;
    balanceTrend?: TrendValue;
    savingsTrend?: TrendValue;
}

/**
 * Calcula el % de variación entre dos valores.
 * Devuelve undefined si no hay referencia válida (previous <= 0).
 */
const calcTrend = (current: number, previous: number): string | undefined => {
    if (previous <= 0) return undefined;
    if (current === previous) return undefined;

    const pct = ((current - previous) / previous) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
};

/**
 * Trend para gastos: bajar es bueno, subir es malo.
 * El % muestra la magnitud absoluta — flecha y color comunican la valoración.
 */
const calcExpenseTrend = (current: number, previous: number): TrendValue | undefined => {
    if (previous <= 0) return undefined;
    if (current === previous) return undefined;

    const pct = ((current - previous) / previous) * 100;
    const isReduction = pct < 0;
    const value = `${Math.abs(pct).toFixed(1)}%`;

    return { value, positive: isReduction };
};

/** Formatea un número como moneda */
const formatCurrency = (amount: number, symbol: string): string => {
    const formatted = Math.abs(amount).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${amount < 0 ? "-" : ""}${symbol} ${formatted}`;
};

/** Devuelve el mes anterior dado (year, month 0-indexed) */
const getPreviousMonth = (year: number, month: number) => {
    if (month === 0) return { year: year - 1, month: 11 };
    return { year, month: month - 1 };
};

export const usePlanningSummaryStripModel = (): PlanningSummaryStripModel => {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeScenario = useActiveScenario();
    const activeMonth = usePlanningStore((s) => s.activeMonth);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const items = useScenarioItems(activeScenarioId);
    const initialBalance = activeScenario?.initialBalance ?? 0;
    const savingsGoal = activeScenario?.savingsGoal ?? 0;
    const currencySymbol = useCurrencySymbol();

    const now = new Date();
    const referenceMonth = now.getMonth();
    const referenceYear = now.getFullYear();

    const summary = useMemo(
        () =>
            calculateMonthlySummary({
                items,
                year: activeYear,
                month: activeMonth,
                initialBalance,
                savingsGoal,
                referenceYear,
                referenceMonth,
            }),
        [items, activeYear, activeMonth, initialBalance, savingsGoal, referenceYear, referenceMonth]
    );

    const prev = getPreviousMonth(activeYear, activeMonth);

    const prevSummary = useMemo(
        () =>
            calculateMonthlySummary({
                items,
                year: prev.year,
                month: prev.month,
                initialBalance,
                savingsGoal,
                referenceYear,
                referenceMonth,
            }),
        [items, prev.year, prev.month, initialBalance, savingsGoal, referenceYear, referenceMonth]
    );

    const incomeTrendValue = calcTrend(summary.totalIncome, prevSummary.totalIncome);
    const balanceTrendValue = calcTrend(summary.netBalance, prevSummary.netBalance);
    const savingsTrendValue = calcTrend(summary.accumulatedSavings, prevSummary.accumulatedSavings);

    return {
        totalIncome: formatCurrency(summary.totalIncome, currencySymbol),
        totalExpense: formatCurrency(summary.totalExpense, currencySymbol),
        netBalance: formatCurrency(summary.netBalance, currencySymbol),
        accumulatedSavings: formatCurrency(summary.accumulatedSavings, currencySymbol),
        incomeTrend: incomeTrendValue
            ? { value: incomeTrendValue, positive: summary.totalIncome >= prevSummary.totalIncome }
            : undefined,
        expenseTrend: calcExpenseTrend(summary.totalExpense, prevSummary.totalExpense),
        balanceTrend: balanceTrendValue
            ? { value: balanceTrendValue, positive: summary.netBalance >= prevSummary.netBalance }
            : undefined,
        savingsTrend: savingsTrendValue
            ? { value: savingsTrendValue, positive: summary.accumulatedSavings >= prevSummary.accumulatedSavings }
            : undefined,
    };
};