import { useMemo } from "react";
import { MONTH_NAMES, type MonthData, type ProjectionAlert } from "./projectionTypes";

const generateProjectionData = (months: number): MonthData[] => {
    const data: MonthData[] = [];
    let balance = 5000;

    const startDate = new Date(2026, 1); // Feb 2026
    const baseIncome = 2800;
    const baseExpenses = 2200;

    for (let i = 0; i <= months; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);
        const monthIndex = date.getMonth();
        const label = `${MONTH_NAMES[monthIndex]} ${date.getFullYear().toString().slice(-2)}`;

        const seasonalExpense =
            monthIndex === 11 ? 900 :
                monthIndex === 7 ? 700 :
                    monthIndex === 0 ? 400 :
                        monthIndex === 8 ? 350 :
                            0;

        const extraIncome =
            monthIndex === 5 ? 2800 :
                monthIndex === 11 ? 2800 :
                    Math.random() > 0.85 ? Math.round(200 + Math.random() * 300) : 0;

        const ingresos = baseIncome + extraIncome + Math.round((Math.random() - 0.5) * 100);
        const gastos = baseExpenses + seasonalExpense + Math.round((Math.random() - 0.5) * 200);
        const cashflow = ingresos - gastos;
        balance += cashflow;

        data.push({
            month: label,
            ingresos,
            gastos,
            cashflow,
            balance,
            isNegativeBalance: balance < 0,
            isNegativeCashflow: cashflow < 0,
            isPeakExpense: gastos > baseExpenses * 1.3,
        });
    }

    return data;
}

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
    const data = useMemo(() => generateProjectionData(selectedMonths), [selectedMonths]);

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
                message: `${peakExpenseMonths} ${peakExpenseMonths === 1 ? "mes" : "meses"} con picos de gasto superiores al 130% del gasto base.`,
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