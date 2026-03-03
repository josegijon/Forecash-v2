import { useMemo } from "react";
import { MONTH_NAMES, type MonthData, type ProjectionAlert } from "./projectionTypes";
import { useScenarioItems, useScenarioStore } from "@/store";
import { useSettingsStore } from "@/store";
import { calculateAccumulatedSavings } from "../../../../../core/src/domain/services/monthly-calculator";

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
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const items = useScenarioItems(activeScenarioId);
    const initialBalance = useSettingsStore((s) => s.initialBalance);

    const data = useMemo((): MonthData[] => {
        const now = new Date();
        const refYear = now.getFullYear();
        const refMonth = now.getMonth();

        // Calcular ingresos/gastos por separado usando items filtrados por mes
        const getMonthlyBreakdown = (year: number, month: number) => {
            const incomeItems = items.filter((item) => item.type === "income");
            const expenseItems = items.filter((item) => item.type === "expense");

            const ingresoBalance = calculateAccumulatedSavings(
                incomeItems,
                0,
                refYear,
                refMonth,
                year,
                month,
            ) - calculateAccumulatedSavings(
                incomeItems,
                0,
                refYear,
                refMonth,
                ...(month === 0
                    ? [year - 1, 11] as [number, number]
                    : [year, month - 1] as [number, number]
                ),
            );

            const gastoBalance = calculateAccumulatedSavings(
                expenseItems,
                0,
                refYear,
                refMonth,
                year,
                month,
            ) - calculateAccumulatedSavings(
                expenseItems,
                0,
                refYear,
                refMonth,
                ...(month === 0
                    ? [year - 1, 11] as [number, number]
                    : [year, month - 1] as [number, number]
                ),
            );

            return {
                ingresos: Math.max(0, ingresoBalance),
                gastos: Math.abs(Math.min(0, gastoBalance)),
            };
        };

        const result: MonthData[] = [];

        for (let i = 0; i <= selectedMonths; i++) {
            const date = new Date(refYear, refMonth + i);
            const year = date.getFullYear();
            const month = date.getMonth();
            const label = `${MONTH_NAMES[month]} ${date.getFullYear().toString().slice(-2)}`;

            const balance = calculateAccumulatedSavings(
                items,
                initialBalance,
                refYear,
                refMonth,
                year,
                month,
            );

            const prevDate = new Date(refYear, refMonth + i - 1);
            const prevBalance = i === 0
                ? initialBalance
                : calculateAccumulatedSavings(
                    items,
                    initialBalance,
                    refYear,
                    refMonth,
                    prevDate.getFullYear(),
                    prevDate.getMonth(),
                );

            const cashflow = i === 0 ? 0 : balance - prevBalance;

            const { ingresos, gastos } = getMonthlyBreakdown(year, month);

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

        // Calcular isPeakExpense sobre los datos reales
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
            data,
            firstPoint,
            lastPoint,
            balanceDiff,
            isPositive,
            negativeMonths,
            peakExpenseMonths,
            minBalance,
            avgCashflow,
            alerts,
        };
    }, [data]);
}