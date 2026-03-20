import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface SummaryCardTrend {
    value: string;
    positive: boolean;
    /** Texto junto al badge (p.ej. "vs mes anterior"). Si se omite, no se muestra. */
    label?: string;
    bgColor?: string;
}

export interface SummaryCardProps {
    label: string;
    value: string;
    icon?: React.ReactNode;
    description?: string;
    trend?: SummaryCardTrend;
}

export const SummaryCard = ({ label, value, icon, description, trend }: SummaryCardProps) => (
    <div className={`max-w-75 w-full rounded-3xl border border-border bg-card text-card-foreground shadow-sm p-6 flex justify-between ${trend ? "items-start" : "items-center"} ${trend?.bgColor ? trend.bgColor : ""}`}>
        <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>

            {trend && (
                <div className="flex items-center gap-1 flex-wrap text-sm">
                    <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${trend.positive ? "text-emerald-600" : "text-red-600"}`}>
                        {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {trend.value}
                    </div>
                    {trend.label && (
                        <span className="text-xs text-muted-foreground">{trend.label}</span>
                    )}
                </div>
            )}

            {description && (
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
        </div>

        {icon && (
            <div className="p-3 bg-primary/20 rounded-full">
                {icon}
            </div>
        )}
    </div>
);