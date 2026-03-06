import { useMemo } from "react";

import {
    calculateAccumulatedSavings,
    calculateMonthlyIncome,
    calculateMonthlyExpenses,
    addMonths,
} from "@core";

import { MONTH_NAMES, type MonthData, type ProjectionAlert } from "./projectionTypes";
import { useActiveScenario, useScenarioItems } from "@/store";

export interface UseProjectionDataReturn {
    data: MonthData[];
    firstPoint: MonthData;
    lastPoint: MonthData;
    balanceDiff: number;
    isPositive: boolean;
    negativeMonths: number;
    peakExpenseMonths: number;
    minBalance: number;
    avgCashflow: number;
    alerts: ProjectionAlert[];
}

export function useProjectionData(selectedMonths: number): UseProjectionDataReturn {
    const activeScenario = useActiveScenario();
    const initialBalance = activeScenario?.initialBalance ?? 0;
    const items = useScenarioItems(activeScenario?.id ?? "");

    const data = useMemo((): MonthData[] => {
        const now = new Date();
        const refYear = now.getFullYear();
        const refMonth = now.getMonth();

        const result: MonthData[] = [];

        for (let i = 0; i <= selectedMonths; i++) {
            // ✅ addMonths del core en lugar de new Date(refYear, refMonth + i)
            const { year, month } = addMonths({ year: refYear, month: refMonth }, i);
            const label = `${MONTH_NAMES[month]} ${String(year).slice(-2)}`;

            const balance = calculateAccumulatedSavings(
                items, initialBalance,
                refYear, refMonth,
                year, month,
            );

            const prevBalance = i === 0
                ? initialBalance
                : (() => {
                    const prev = addMonths({ year: refYear, month: refMonth }, i - 1);
                    return calculateAccumulatedSavings(
                        items, initialBalance,
                        refYear, refMonth,
                        prev.year, prev.month,
                    );
                })();

            const cashflow = i === 0 ? 0 : balance - prevBalance;

            // ✅ calculateMonthlyIncome/Expenses directamente — sin workaround de diferencia
            const ingresos = calculateMonthlyIncome({ items, year, month });
            const gastos = calculateMonthlyExpenses({ items, year, month });

            result.push({
                month: label,
                ingresos,
                gastos,
                cashflow,
                balance,
                isNegativeBalance: balance < 0,
                isNegativeCashflow: cashflow < 0,
                isPeakExpense: false,
            });
        }

        const avgGastos = result.reduce((sum, d) => sum + d.gastos, 0) / result.length;
        return result.map((d) => ({
            ...d,
            isPeakExpense: d.gastos > 0 && d.gastos > avgGastos * 1.3,
        }));
    }, [items, initialBalance, selectedMonths]);

    return useMemo(() => {
        const lastPoint = data[data.length - 1];
        const firstPoint = data[0];
        const balanceDiff = lastPoint.balance - firstPoint.balance;
        const isPositive = balanceDiff >= 0;

        const negativeMonths = data.filter((d) => d.isNegativeCashflow).length;
        const peakExpenseMonths = data.filter((d) => d.isPeakExpense).length;
        const minBalance = Math.min(...data.map((d) => d.balance));
        const avgCashflow = Math.round(
            data.reduce((sum, d) => sum + d.cashflow, 0) / data.length
        );

        const alerts: ProjectionAlert[] = [];
        const negBalanceMonths = data.filter((d) => d.isNegativeBalance);

        if (negBalanceMonths.length > 0) {
            alerts.push({
                type: "danger",
                message: `Tu balance entra en negativo en ${negBalanceMonths.length} ${negBalanceMonths.length === 1 ? "mes" : "meses"}. El punto más bajo es ${minBalance.toLocaleString("es-ES")} €.`,
            });
        }
        if (negativeMonths >= 3) {
            alerts.push({
                type: "warning",
                message: `Tienes ${negativeMonths} meses con cashflow negativo. Revisa tus gastos en esos periodos.`,
            });
        }
        if (peakExpenseMonths > 0) {
            alerts.push({
                type: "warning",
                message: `${peakExpenseMonths} ${peakExpenseMonths === 1 ? "mes" : "meses"} con picos de gasto superiores al 130% de la media.`,
            });
        }
        if (avgCashflow > 0 && negativeMonths === 0) {
            alerts.push({
                type: "info",
                message: `Margen medio positivo de ${avgCashflow.toLocaleString("es-ES")} €/mes. Tu plan es sostenible.`,
            });
        }

        return {
            data, firstPoint, lastPoint,
            balanceDiff, isPositive,
            negativeMonths, peakExpenseMonths,
            minBalance, avgCashflow, alerts,
        };
    }, [data]);
}