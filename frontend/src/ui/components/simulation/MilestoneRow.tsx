import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { type DataPoint } from "./types";
import { fmt } from "@/ui/utils/format";
import { useCurrencySymbol } from "@/store";

interface MilestoneRowProps {
    milestone: number;
    point: DataPoint;
}

const milestoneLabel = (m: number): string => {
    if (m < 12) return `${m}m`;
    if (m === 12) return "1 año";
    if (m === 24) return "2 años";
    if (m === 60) return "5 años";
    return `${m}m`;
};

const milestoneLabelLong = (m: number): string => {
    if (m < 12) return `${m} meses`;
    if (m === 12) return "1 año";
    if (m === 24) return "2 años";
    if (m === 60) return "5 años";
    return `${m} meses`;
};

export const MilestoneRow = ({ milestone, point }: MilestoneRowProps) => {
    const currencySymbol = useCurrencySymbol();

    const diff = point.diferencia;
    const isPositive = diff >= 0;

    return (
        <tr className="border-b border-border transition-colors hover:bg-muted/50">
            {/* Periodo */}
            <td className="py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm whitespace-nowrap">
                <span className="xs:hidden">{milestoneLabel(milestone)}</span>
                <span className="hidden xs:inline">{milestoneLabelLong(milestone)}</span>
            </td>

            {/* Actual — siempre visible */}
            <td className="py-3 px-3 sm:px-4 text-right font-medium text-xs sm:text-sm whitespace-nowrap">
                {currencySymbol}{fmt(point.actual)}
            </td>

            {/* Escenario comparado */}
            <td className="py-3 px-3 sm:px-4 text-right font-medium text-xs sm:text-sm whitespace-nowrap">
                {currencySymbol}{fmt(point.comparado)}
            </td>

            {/* Diferencia */}
            <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                <span className={`inline-flex items-center justify-end gap-0.5 font-semibold text-xs sm:text-sm ${isPositive ? "text-success" : "text-chart-line"}`}>
                    {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {isPositive ? "+" : ""}
                    {currencySymbol}{fmt(diff)}
                </span>
            </td>
        </tr>
    );
};