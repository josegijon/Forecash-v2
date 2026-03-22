import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface SummaryCardTrend {
    value: string;
    positive: boolean;
    label?: string;
}

export interface SummaryCardProps {
    label: string;
    value: string;
    icon?: React.ReactNode;
    description?: string;
    trend?: SummaryCardTrend;
    isBaseline?: boolean;
    isResult?: boolean;
}

export const SummaryCard = ({ label, value, icon, description, trend, isBaseline, isResult }: SummaryCardProps) => (
    <div className={`max-w-75 w-full rounded-3xl border bg-card text-card-foreground shadow-sm p-6 flex justify-between ${trend ? "items-start" : "items-center"} ${isBaseline ? "border-primary/40 ring-1 ring-primary/20" : isResult ? "border-foreground/20 ring-1 ring-foreground/10" : "border-border"}`}>
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{label}</p>
                {isBaseline && (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-badge-neutral-bg text-badge-neutral-fg">
                        Base
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold">{value}</p>

            {trend && (
                <div className="flex items-center gap-1 flex-wrap text-sm">
                    <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${trend.positive
                            ? "bg-badge-success-bg text-badge-success-fg"
                            : "bg-badge-danger-bg text-badge-danger-fg"
                        }`}>
                        {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trend.value}
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