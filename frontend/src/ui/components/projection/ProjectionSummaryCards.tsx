import { AlertTriangle, PiggyBank, TrendingDown, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { KpiCard } from "../kpi/KpiCard";

interface ProjectionSummaryCardsProps {
    currentBalance: number;
    finalBalance: number;
    balanceDiff: number;
    isPositive: boolean;
    avgCashflow: number;
    negativeMonths: number;
    selectedMonths: number;
}

export const ProjectionSummaryCards = ({
    currentBalance,
    finalBalance,
    balanceDiff,
    isPositive,
    avgCashflow,
    negativeMonths,
    selectedMonths,
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
            value={"-820 €"}
            icon={<Wallet size={16} className="text-blue-600" />}
            description="Mes con mayor déficit: Marzo 2026"
        />

        {/* Ratio de meses negativos */}
        <KpiCard
            title="Meses negativos"
            value={"16%"}
            icon={<PiggyBank size={16} className="text-blue-600" />}
            description={`4 de ${selectedMonths} meses con cashflow negativo`}
        />

        {/* Mes de ruptura */}
        {/* Hacerlo como banner en el caso de que si haya */}
        {/* <div className="bg-card-light rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Wallet size={16} className="text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Mes de ruptura
                </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
                Marzo 2026
            </p>
        </div> */}

        {/* Meses en riesgo */}
        {/* <div className={`rounded-2xl border p-5 ${negativeMonths > 0 ? "bg-amber-50/60 border-amber-200" : "bg-card-light border-slate-200"}`}>
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${negativeMonths > 0 ? "bg-amber-100" : "bg-slate-100"}`}>
                    <AlertTriangle size={16} className={negativeMonths > 0 ? "text-amber-600" : "text-slate-400"} />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Meses en Riesgo
                </span>
            </div>
            <p className={`text-2xl font-bold ${negativeMonths > 0 ? "text-amber-700" : "text-slate-900"}`}>
                {negativeMonths}
            </p>
            <p className="text-xs text-slate-500 mt-1">Con cashflow negativo</p>
        </div> */}
    </div>
);