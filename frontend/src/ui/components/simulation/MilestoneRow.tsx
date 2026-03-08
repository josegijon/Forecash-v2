import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { type DataPoint, fmt } from "./types";

interface MilestoneRowProps {
    milestone: number;
    point: DataPoint;
}

const milestoneLabel = (m: number) => {
    if (m < 12) return `${m} meses`;
    if (m === 12) return "1 año";
    if (m === 24) return "2 años";
    return "5 años";
};

export const MilestoneRow = ({ milestone, point }: MilestoneRowProps) => {
    const diff = point.diferencia;
    const isPositive = diff >= 0;

    return (
        <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
            <td className="py-3 px-4 font-medium text-slate-700">
                {milestoneLabel(milestone)}
            </td>

            <td className="py-3 px-4 text-right text-slate-700 font-medium">
                {fmt(point.actual)} €
            </td>

            <td className="py-3 px-4 text-right text-slate-700 font-medium">
                {fmt(point.comparado)} €
            </td>

            <td className="py-3 px-4 text-right">
                <span className={`inline-flex items-center gap-1 font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {isPositive ? "+" : ""}
                    {fmt(diff)} €
                </span>
            </td>
        </tr>
    );
};