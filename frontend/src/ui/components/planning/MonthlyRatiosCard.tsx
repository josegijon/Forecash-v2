import { PercentCircle, TrendingDown } from "lucide-react";

import { RatioProgressBar } from "./RatioProgressBar";
import { useMonthlyRatiosSummary } from "./useMonthlyRatiosSummary";

interface MonthlyRatiosCardProps {
    title: string;
}

// Devuelve el color de la barra de tasa de ahorro
const getSavingsRateColor = (rate: number): string => {
    if (rate < 0) return "#ef4444"; // negativo → rojo
    return "#10b981";               // positivo → verde
};

// Devuelve el color de la barra de tasa de gasto según proximidad al 100%
const getExpenseRateColor = (rate: number): string => {
    if (rate >= 100) return "#ef4444";  // exceso → rojo
    if (rate >= 96) return "#f97316";  // peligro → naranja
    if (rate >= 81) return "#f59e0b";  // alerta  → ámbar
    return "#10b981";                   // saludable → verde
};

export const MonthlyRatiosCard = ({ title }: MonthlyRatiosCardProps) => {
    const summary = useMonthlyRatiosSummary();
    const hasNoIncome = summary.totalIncome === 0;

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PercentCircle size={18} className="text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 capitalize">
                    {title}
                </h3>
            </div>

            {hasNoIncome ? (
                <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <TrendingDown size={20} className="text-slate-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-600">
                            Sin ingresos este mes
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Añade ingresos para calcular los ratios
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <RatioProgressBar
                        label="Tasa de ahorro"
                        percentage={summary.savingsRate}
                        color={getSavingsRateColor(summary.savingsRate)}
                    />
                    <RatioProgressBar
                        label="Tasa de gasto"
                        percentage={summary.expenseRate}
                        color={getExpenseRateColor(summary.expenseRate)}
                    />
                </div>
            )}
        </div>
    );
};