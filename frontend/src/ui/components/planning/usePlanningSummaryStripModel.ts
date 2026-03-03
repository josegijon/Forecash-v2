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
}

interface RawTrend {
    value: string;
}

/** Calcula el % de variación entre dos valores. Devuelve null si no hay referencia. */
const calcTrend = (current: number, previous: number): RawTrend | undefined => {
    if (previous === 0 && current === 0) return undefined;
    if (previous === 0) return { value: "nuevo" };

    const pct = ((current - previous) / Math.abs(previous)) * 100;
    return { value: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%` };
};

/** Formatea un número como moneda: €1.050,00 */
const formatCurrency = (amount: number, symbol: string): string => {
    const formatted = Math.abs(amount).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `${amount < 0 ? "-" : ""}${symbol}${formatted}`;
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

    const incomeTrendRaw = calcTrend(summary.totalIncome, prevSummary.totalIncome);
    const expenseTrendRaw = calcTrend(summary.totalExpense, prevSummary.totalExpense);
    const balanceTrendRaw = calcTrend(summary.netBalance, prevSummary.netBalance);

    return {
        totalIncome: formatCurrency(summary.totalIncome, currencySymbol),
        totalExpense: formatCurrency(summary.totalExpense, currencySymbol),
        netBalance: formatCurrency(summary.netBalance, currencySymbol),
        accumulatedSavings: formatCurrency(summary.accumulatedSavings, currencySymbol),
        incomeTrend: incomeTrendRaw
            ? { ...incomeTrendRaw, positive: summary.totalIncome >= prevSummary.totalIncome }
            : undefined,
        expenseTrend: expenseTrendRaw
            ? { ...expenseTrendRaw, positive: summary.totalExpense <= prevSummary.totalExpense }
            : undefined,
        balanceTrend: balanceTrendRaw
            ? { ...balanceTrendRaw, positive: summary.netBalance >= prevSummary.netBalance }
            : undefined,
    };
};
