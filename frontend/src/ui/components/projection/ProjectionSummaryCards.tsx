import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { KpiCard } from "../kpi/KpiCard";
import type { MonthData } from "./projectionTypes";

interface ProjectionSummaryCardsProps {
    currentBalance: number;
    finalBalance: number;
    balanceDiff: number;
    isPositive: boolean;
    avgCashflow: number;
    negativeMonths: number;
    selectedMonths: number;
    minBalance: number;
    worstMonth: MonthData | undefined;
}

export const ProjectionSummaryCards = ({
    currentBalance,
    finalBalance,
    balanceDiff,
    isPositive,
    avgCashflow,
    negativeMonths,
    selectedMonths,
    minBalance,
    worstMonth,
}: ProjectionSummaryCardsProps) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance actual */}
        <KpiCard
            title="Balance Actual"
            value={currentBalance.toLocaleString("es-ES") + " €"}
            icon={<Wallet size={16} className="text-blue-600" />}
            description="Punto de partida"
        />

        {/* Balance proyectado */}
        <KpiCard
            title="Balance Final"
            value={finalBalance.toLocaleString("es-ES") + " €"}
            icon={isPositive
                ? <TrendingUp size={16} className="text-emerald-600" />
                : <TrendingDown size={16} className="text-red-600" />
            }
            description={`En ${selectedMonths} meses`}
            variant="success"
            delta={{
                value: `${isPositive ? "+" : ""}${balanceDiff.toLocaleString("es-ES")} €`,
                direction: isPositive ? "up" : "down",
                variant: isPositive ? "success" : "danger"
            }}
        />

        {/* Peor mes */}
        <KpiCard
            title="Peor mes"
            value={worstMonth ? `${minBalance.toLocaleString("es-ES")} €` : "—"}
            icon={<Wallet size={16} className="text-blue-600" />}
            description={worstMonth ? `Balance mínimo: ${worstMonth.month}` : "Sin meses negativos"}
        />

        {/* Ratio de meses negativos */}
        <KpiCard
            title="Meses negativos"
            value={selectedMonths > 0 ? `${Math.round((negativeMonths / selectedMonths) * 100)}%` : "0%"}
            icon={<PiggyBank size={16} className="text-blue-600" />}
            description={`${negativeMonths} de ${selectedMonths} meses con cashflow negativo`}
        />
    </div>
);