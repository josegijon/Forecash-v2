import { Layers, GitCompareArrows, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { StatCard } from "./StatCard";

interface Props {
    actualBalance: number;
    comparedBalance: number;
    scenarioName: string;
    selectedMonths: number;
}

export const SimulationSummaryCards = ({ actualBalance, comparedBalance, scenarioName, selectedMonths }: Props) => {
    const diff = comparedBalance - actualBalance;

    const diffPercent = actualBalance !== 0
        ? ((diff / actualBalance) * 100).toFixed(1)
        : null;

    const isPositive = diff >= 0;

    const fmt = (n: number) =>
        n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
                icon={<Layers size={16} className="text-blue-600" />}
                iconBg="bg-blue-100"
                label="Escenario Actual"
                value={`${fmt(actualBalance)} €`}
                description={`Saldo proyectado a ${selectedMonths} meses`}
                className="bg-card-light border-slate-200"
            />

            <StatCard
                icon={<GitCompareArrows size={16} className="text-indigo-600" />}
                iconBg="bg-indigo-100"
                label={scenarioName}
                value={`${fmt(comparedBalance)} €`}
                description={`Saldo proyectado a ${selectedMonths} meses`}
                className="bg-card-light border-slate-200"
            />

            <StatCard
                icon={
                    isPositive
                        ? <TrendingUp size={16} className="text-emerald-600" />
                        : <TrendingDown size={16} className="text-red-600" />
                }
                iconBg={isPositive ? "bg-emerald-100" : "bg-red-100"}
                label="Diferencia"
                value={`${isPositive ? "+" : ""}${fmt(diff)} €`}
                description={`El ${scenarioName.toLowerCase()} ${isPositive ? "supera" : "queda por debajo de"} tu escenario actual`}
                className={isPositive ? "bg-emerald-50/60 border-emerald-200" : "bg-red-50/60 border-red-200"}
            >
                {diffPercent !== null && (
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 mb-1 ${isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {diffPercent}%
                    </span>
                )}
            </StatCard>
        </div>
    );
};