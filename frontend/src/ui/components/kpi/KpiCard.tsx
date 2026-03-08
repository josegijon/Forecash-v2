type KpiVariant = "neutral" | "success" | "danger" | "warning";

interface KpiDelta {
    value: string;
    variant?: KpiVariant;
}

interface KpiCardProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
    description?: string;
    variant?: KpiVariant;
    delta?: KpiDelta;
    align?: "left" | "between";
}

const variantStyles: Record<KpiVariant, string> = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    danger: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-700",
};

export const KpiCard = ({ title, value, icon, description, variant = "neutral", delta, align = "left" }: KpiCardProps) => (
    <div className="bg-card-light rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-2">
            {icon && (
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    {icon}
                </div>
            )}
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {title}
            </span>
        </div>

        <div className={`flex items-end gap-2 ${align === "between" ? "justify-between" : ""}`}>  {/* ← sin salto de línea */}
            <p className="text-2xl font-bold text-slate-900">
                {value}
            </p>
            {delta && (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${variantStyles[delta.variant ?? "neutral"]}`}>
                    {delta.value}
                </span>
            )}
        </div>

        {description && (
            <p className="text-xs text-slate-500 mt-1">
                {description}
            </p>
        )}
    </div>
);