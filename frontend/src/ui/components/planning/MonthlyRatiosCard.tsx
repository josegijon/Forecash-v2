import { PiggyBank, TrendingDown } from "lucide-react";

import { RatioProgressBar } from "./RatioProgressBar";
import { useMonthlyRatiosSummary } from "./useMonthlyRatiosSummary";

interface MonthlyRatiosCardProps {
    title: string;
}

// Devuelve el color de la barra de tasa de ahorro
const getSavingsRateColor = (rate: number): string => {
    if (rate <= 0) return "#ef4444"; // negativo → rojo
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
        <div className="rounded-3xl border-0 text-card-foreground bg-transparent shadow-none p-0">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    {title}
                </h3>
            </div>

            {hasNoIncome ? (
                <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <TrendingDown size={22} className="text-muted-foreground/40" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-muted-foreground">
                            Sin ingresos este mes
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Añade ingresos para calcular los ratios
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <RatioProgressBar
                        label="Tasa de ahorro"
                        percentage={summary.savingsRate * 100}
                        color={getSavingsRateColor(summary.savingsRate)}
                        icon={<PiggyBank size={16} />}
                        bgClass="bg-emerald-100"
                    />
                    <RatioProgressBar
                        label="Tasa de gasto"
                        percentage={summary.expenseRate * 100}
                        color={getExpenseRateColor(summary.expenseRate)}
                        icon={<TrendingDown size={16} />}
                        bgClass="bg-rose-100"
                    />
                </div>
            )}
        </div>
    );
};