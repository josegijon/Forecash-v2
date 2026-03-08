import {
    AlertTriangle, ArrowDownRight, ArrowUpRight,
    ChevronDown, Clock, ShieldAlert, TrendingUp,
} from "lucide-react";
import type { MonthData } from "./projectionTypes";
import { fmt } from "../simulation/types";

interface ProjectionDetailTableProps {
    data: MonthData[];
}

const StatusBadge = ({ row }: { row: MonthData }) => {
    if (row.isNegativeBalance) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                <ShieldAlert size={12} />
                Negativo
            </span>
        );
    }
    if (row.isPeakExpense) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle size={12} />
                Pico
            </span>
        );
    }
    if (row.isNegativeCashflow) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                <ChevronDown size={12} />
                Déficit
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
            <TrendingUp size={12} />
            OK
        </span>
    );
};

export const ProjectionDetailTable = ({ data }: ProjectionDetailTableProps) => (
    <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
            <Clock size={20} className="text-primary" />
            <h3 className="font-bold text-slate-900">Detalle mensual</h3>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-200">
                        {["Mes", "Ingresos", "Gastos", "Cashflow", "Balance", "Estado"].map((col, i) => (
                            <th
                                key={col}
                                className={`py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider ${i === 0 ? "text-left" : i === 5 ? "text-center" : "text-right"}`}
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => {
                        const cfPositive = row.cashflow >= 0;
                        return (
                            <tr
                                key={i}
                                className={`border-b border-slate-100 transition-colors ${row.isNegativeBalance
                                    ? "bg-red-50/50"
                                    : row.isPeakExpense
                                        ? "bg-amber-50/40"
                                        : "hover:bg-slate-50/50"
                                    }`}
                            >
                                <td className="py-3 px-4 font-medium text-slate-700">{row.month}</td>
                                <td className="py-3 px-4 text-right text-slate-700">
                                    {fmt(row.ingresos)} €
                                </td>
                                <td className="py-3 px-4 text-right text-slate-700">
                                    {fmt(row.gastos)} €
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <span className={`inline-flex items-center gap-1 font-semibold ${cfPositive ? "text-emerald-600" : "text-red-600"}`}>
                                        {cfPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {cfPositive ? "+" : ""}{fmt(row.cashflow)} €
                                    </span>
                                </td>
                                <td className={`py-3 px-4 text-right font-medium ${row.isNegativeBalance ? "text-red-700" : "text-slate-700"}`}>
                                    {fmt(row.balance)} €
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <StatusBadge row={row} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);