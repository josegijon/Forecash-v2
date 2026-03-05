import { Layers, GitCompareArrows, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card-light rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Layers size={16} className="text-blue-600" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Escenario Actual</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                    {actualBalance.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    Saldo proyectado a {selectedMonths} meses
                </p>
            </div>

            <div className="bg-card-light rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <GitCompareArrows size={16} className="text-indigo-600" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {scenarioName}
                    </span>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                    {comparedBalance.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    Saldo proyectado a {selectedMonths} meses
                </p>
            </div>

            <div className={`rounded-2xl border p-5 ${isPositive ? "bg-emerald-50/60 border-emerald-200" : "bg-red-50/60 border-red-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPositive ? "bg-emerald-100" : "bg-red-100"}`}>
                        {isPositive
                            ? <TrendingUp size={16} className="text-emerald-600" />
                            : <TrendingDown size={16} className="text-red-600" />
                        }
                    </div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Diferencia</span>
                </div>
                <div className="flex items-end gap-2">
                    <p className={`text-2xl font-bold ${isPositive ? "text-emerald-700" : "text-red-700"}`}>
                        {isPositive ? "+" : ""}{diff.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </p>
                    {diffPercent !== null && (
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {diffPercent}%
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    El {scenarioName.toLowerCase()} {isPositive ? "supera" : "queda por debajo de"} tu escenario actual
                </p>
            </div>
        </div>
    );
};