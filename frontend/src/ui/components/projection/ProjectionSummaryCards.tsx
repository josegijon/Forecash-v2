import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { KpiCard } from "../kpi/KpiCard";
import type { MonthData } from "./projectionTypes";
import { fmt } from "../simulation/types";

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
}: ProjectionSummaryCardsProps) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
            title="Balance Actual"
            value={fmt(currentBalance) + " €"}
            icon={<Wallet size={16} className="text-blue-600" />}
            description="Punto de partida"
        />
        <KpiCard
            title="Balance Final"
            value={fmt(finalBalance) + " €"}
            icon={isPositive
                ? <TrendingUp size={16} className="text-emerald-600" />
                : <TrendingDown size={16} className="text-red-600" />
            }
            description={`En ${selectedMonths} meses`}
            variant="success"
            delta={{
                value: `${isPositive ? "+" : ""}${fmt(balanceDiff)} €`,
                variant: isPositive ? "success" : "danger",
            }}
        />
        <KpiCard
            title="Peor mes"
            value={worstMonth ? `${fmt(minBalance)} €` : "—"}
            icon={<Wallet size={16} className="text-blue-600" />}
            description={worstMonth ? `Balance mínimo: ${worstMonth.month}` : "Sin meses negativos"}
        />
        <KpiCard
            title="Meses negativos"
            value={`${Math.round((negativeMonths / selectedMonths) * 100)}%`}
            icon={<PiggyBank size={16} className="text-blue-600" />}
            description={`${negativeMonths} de ${selectedMonths} meses con cashflow negativo`}
        />
    </div>
);