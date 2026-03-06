import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react"

import { usePlanningSummaryStripModel } from "./usePlanningSummaryStripModel"

interface SummaryCardProps {
    label: string
    value: string
    icon: React.ReactNode
    trend?: { value: string; positive: boolean }
    accentClass: string
    bgClass: string
}

const SummaryCard = ({ label, value, icon, trend, accentClass, bgClass }: SummaryCardProps) => (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${accentClass}`}>
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-xl font-extrabold text-slate-800">{value}</span>
            {trend && (
                <span className={`text-[11px] font-semibold ${trend.positive ? "text-emerald-500" : "text-rose-500"}`}>
                    {trend.positive ? "↑" : "↓"} {trend.value} vs mes anterior
                </span>
            )}
        </div>
    </div>
);

export const PlanningSummaryStrip = () => {

    const model = usePlanningSummaryStripModel();

    const cards: SummaryCardProps[] = [
        {
            label: "Ingresos totales",
            value: model.totalIncome,
            icon: <TrendingUp size={22} />,
            trend: model.incomeTrend,
            accentClass: "text-emerald-600",
            bgClass: "bg-emerald-50",
        },
        {
            label: "Gastos totales",
            value: model.totalExpense,
            icon: <TrendingDown size={22} />,
            trend: model.expenseTrend,
            accentClass: "text-rose-600",
            bgClass: "bg-rose-50",
        },
        {
            label: "Balance neto",
            value: model.netBalance,
            icon: <Wallet size={22} />,
            trend: model.balanceTrend,
            accentClass: "text-blue-600",
            bgClass: "bg-blue-50",
        },
        {
            label: "Ahorro acumulado",
            value: model.accumulatedSavings,
            icon: <PiggyBank size={22} />,
            accentClass: "text-violet-600",
            bgClass: "bg-violet-50",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
                <SummaryCard key={card.label} {...card} />
            ))}
        </div>
    );
};
