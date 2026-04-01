import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { type DataPoint } from "./types";
import { fmt } from "@/ui/utils/format";
import { useCurrencySymbol } from "@/store";

interface MilestoneMobileCardProps {
    milestone: number;
    point: DataPoint;
    scenarioName: string;
}

const milestoneLabelLong = (m: number): string => {
    if (m < 12) return `${m} meses`;
    if (m === 12) return "1 año";
    if (m === 24) return "2 años";
    if (m === 60) return "5 años";
    return `${m} meses`;
};

export const MilestoneMobileCard = ({ milestone, point, scenarioName }: MilestoneMobileCardProps) => {
    const currencySymbol = useCurrencySymbol();

    const diff = point.diferencia;
    const isPositive = diff >= 0;

    return (
        <div className="bg-card rounded-2xl px-4 py-3 border border-border space-y-2 mb-2">
            <span className="text-sm font-semibold">{milestoneLabelLong(milestone)}</span>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Actual</span>
                <span className="font-medium text-foreground">{currencySymbol}{fmt(point.actual)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{scenarioName}</span>
                <span className="font-medium text-foreground">{currencySymbol}{fmt(point.comparado)}</span>
            </div>

            <div className="border-t border-border/60" />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Diferencia</span>
                <span className={`inline-flex items-center gap-0.5 font-semibold ${isPositive ? "text-success" : "text-chart-line"}`}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {isPositive ? "+" : ""}{currencySymbol}{fmt(diff)}
                </span>
            </div>
        </div>
    );
};