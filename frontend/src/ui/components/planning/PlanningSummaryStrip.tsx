import { SummaryCard, type SummaryCardProps } from "../kpi/SummaryCard";
import { usePlanningSummaryStripModel } from "./usePlanningSummaryStripModel";

export const PlanningSummaryStrip = () => {
    const model = usePlanningSummaryStripModel();

    const cards: SummaryCardProps[] = [
        {
            label: "Balance neto",
            value: model.netBalance,
            trend: model.balanceTrend
                ? { ...model.balanceTrend, label: "vs mes anterior" }
                : undefined,
            isResult: true,
        },
        {
            label: "Ahorro acumulado",
            value: model.accumulatedSavings,
            description: "Total acumulado desde el inicio",
            trend: model.savingsTrend
                ? { ...model.savingsTrend, label: "vs mes anterior" }
                : undefined,
        },
        {
            label: "Ingresos totales",
            value: model.totalIncome,
            trend: model.incomeTrend
                ? { ...model.incomeTrend, label: "vs mes anterior" }
                : undefined,
        },
        {
            label: "Gastos totales",
            value: model.totalExpense,
            trend: model.expenseTrend
                ? { ...model.expenseTrend, label: "vs mes anterior" }
                : undefined,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 justify-items-stretch">
            {cards.map((card) => (
                <SummaryCard key={card.label} {...card} />
            ))}
        </div>
    );
};