import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";

import { usePlanningSummaryStripModel } from "./usePlanningSummaryStripModel";

interface SummaryCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    trend?: { value: string; positive: boolean };
}

const SummaryCard = ({ label, value, icon, trend }: SummaryCardProps) => (
    <div className={`rounded-3xl border-0 bg-card text-card-foreground shadow-sm p-6 flex justify-between ${trend ? 'items-start' : 'items-center'}`}>
        <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
                {label}
            </p>
            <p className="text-2xl font-bold">
                {value}
            </p>

            {trend && (
                <div className="flex items-center gap-1 text-sm">
                    <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${trend.positive ? "text-emerald-600" : "text-red-600"}`}>
                        {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {trend.value}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        vs mes anterior
                    </span>
                </div>
            )}
        </div>

        <div className="p-3 bg-primary/20 rounded-full">
            {icon}
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
        },
        {
            label: "Gastos totales",
            value: model.totalExpense,
            icon: <TrendingDown size={22} />,
            trend: model.expenseTrend,
        },
        {
            label: "Balance neto",
            value: model.netBalance,
            icon: <Wallet size={22} />,
            trend: model.balanceTrend,
        },
        {
            label: "Ahorro acumulado",
            value: model.accumulatedSavings,
            icon: <PiggyBank size={22} />,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
                <SummaryCard key={card.label} {...card} />
            ))}
        </div>
    );
};