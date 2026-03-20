import { SummaryCard } from "../kpi/SummaryCard";
import type { MonthData } from "../../utils/projectionTypes";
import { fmt } from "@/ui/utils/format";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
            <SummaryCard
                label="Balance Actual"
                value={`${fmt(currentBalance)} ${currencySymbol}`}
                description="Punto de partida"
            />
            <SummaryCard
                label="Balance Final"
                value={`${fmt(finalBalance)} ${currencySymbol}`}
                trend={{
                    value: `${isPositive ? "+" : ""}${fmt(balanceDiff)} ${currencySymbol}`,
                    positive: isPositive,
                    label: `En ${selectedMonths} meses`,
                }}
            />
            <SummaryCard
                label="Peor mes"
                value={worstMonth ? worstMonth.month : "—"}
                description={worstMonth
                    ? `Balance mínimo: ${fmt(minBalance)} ${currencySymbol}`
                    : "Sin meses negativos"
                }
            />
            <SummaryCard
                label="Meses negativos"
                value={negativeMonths === 0 ? "Ninguno" : `${negativeMonths} de ${selectedMonths}`}
                description={negativeMonths === 0
                    ? "Sin cashflow negativo"
                    : "meses con cashflow negativo"
                }
            />
        </div>
    );
};