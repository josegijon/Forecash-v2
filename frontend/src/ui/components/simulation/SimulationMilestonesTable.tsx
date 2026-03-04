import { Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface DataPoint {
    month: string;
    actual: number;
    comparado: number;
    diferencia: number;
}

interface Props {
    data: DataPoint[];
    scenarioName: string;
    selectedMonths: number;
}

const MILESTONES = [3, 6, 12, 24, 60];

const milestoneLabel = (m: number) => {
    if (m < 12) return `${m} meses`;
    if (m === 12) return "1 año";
    if (m === 24) return "2 años";
    return "5 años";
};

export const SimulationMilestonesTable = ({ data, scenarioName, selectedMonths }: Props) => (
    <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
            <Clock size={20} className="text-primary" />
            <h3 className="font-bold text-slate-900">Resumen por hitos</h3>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Periodo</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actual</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{scenarioName}</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Diferencia</th>
                    </tr>
                </thead>
                <tbody>
                    {MILESTONES.filter((m) => m <= selectedMonths).map((m) => {
                        const point = data[Math.min(m, data.length - 1)];
                        const d = point.diferencia;
                        const pos = d >= 0;
                        return (
                            <tr key={m} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4 font-medium text-slate-700">
                                    {milestoneLabel(m)}
                                </td>
                                <td className="py-3 px-4 text-right text-slate-700 font-medium">
                                    {point.actual.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                </td>
                                <td className="py-3 px-4 text-right text-slate-700 font-medium">
                                    {point.comparado.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <span className={`inline-flex items-center gap-1 font-semibold ${pos ? "text-emerald-600" : "text-red-600"}`}>
                                        {pos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {pos ? "+" : ""}{d.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);