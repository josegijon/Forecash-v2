import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

import { SummaryCard, type SummaryCardProps } from "../kpi/SummaryCard";
import { usePlanningSummaryStripModel } from "./usePlanningSummaryStripModel";

export const PlanningSummaryStrip = () => {
    const model = usePlanningSummaryStripModel();

    const cards: SummaryCardProps[] = [
        {
            label: "Ingresos totales",
            value: model.totalIncome,
            icon: <TrendingUp size={22} />,
            trend: model.incomeTrend
                ? { ...model.incomeTrend, label: "vs mes anterior" }
                : undefined,
        },
        {
            label: "Gastos totales",
            value: model.totalExpense,
            icon: <TrendingDown size={22} />,
            trend: model.expenseTrend
                ? { ...model.expenseTrend, label: "vs mes anterior" }
                : undefined,
        },
        {
            label: "Balance neto",
            value: model.netBalance,
            icon: <Wallet size={22} />,
            trend: model.balanceTrend
                ? { ...model.balanceTrend, label: "vs mes anterior" }
                : undefined,
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