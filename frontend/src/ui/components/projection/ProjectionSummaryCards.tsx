import { SummaryCard } from "../kpi/SummaryCard";
import type { MonthData } from "./projectionTypes";
import { fmt } from "../simulation/types";
import { useCurrencySymbol } from "@/store";

interface ProjectionSummaryCardsProps {
    currentBalance: number;
    finalBalance: number;
    balanceDiff: number;
    isPositive: boolean;
    negativeMonths: number;
    selectedMonths: number;
    minBalance: number;
    worstMonth?: MonthData;
}

export const ProjectionSummaryCards = ({
    currentBalance,
    finalBalance,
    balanceDiff,
    isPositive,
    negativeMonths,
    selectedMonths,
    minBalance,
    worstMonth,
}: ProjectionSummaryCardsProps) => {
    const currencySymbol = useCurrencySymbol();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
                label="Balance Actual"
                value={`${fmt(currentBalance)} ${currencySymbol}`}
                description="Punto de partida"
            />
            <SummaryCard
                label="Balance Final"
                value={`${fmt(finalBalance)} ${currencySymbol}`}
                // description={`En ${selectedMonths} meses`}
                trend={{
                    value: `${isPositive ? "+" : ""}${fmt(balanceDiff)} ${currencySymbol}`,
                    positive: isPositive,
                    label: `En ${selectedMonths} meses`
                }}
            />
            <SummaryCard
                label="Peor mes"
                value={worstMonth ? `${fmt(minBalance)} ${currencySymbol}` : "—"}
                description={worstMonth ? `Balance mínimo: ${worstMonth.month}` : "Sin meses negativos"}
            />
            <SummaryCard
                label="Meses negativos"
                value={`${Math.round((negativeMonths / selectedMonths) * 100)}%`}
                description={`${negativeMonths} de ${selectedMonths} meses con cashflow negativo`}
            />
        </div>
    );
};