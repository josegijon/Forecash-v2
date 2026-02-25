import { PercentCircle } from "lucide-react"
import { RatioProgressBar } from "./RatioProgressBar";
import { useMemo } from "react";
import { calculateMonthlySummary, isActiveMonth } from "@core";
import { usePlanningStore, useScenarioItems, useScenarioStore, useSettingsStore } from "@/store";

interface MonthlyRatiosCardProps {
    title: string;
}

export const MonthlyRatiosCard = ({ title }: MonthlyRatiosCardProps) => {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeMonth = usePlanningStore((s) => s.activeMonth);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const allItems = useScenarioItems(activeScenarioId);
    const initialBalance = useSettingsStore((s) => s.initialBalance);
    const savingsGoal = useSettingsStore((s) => s.savingsGoal);

    const now = new Date();
    const referenceMonth = now.getMonth();
    const referenceYear = now.getFullYear();

    const items = allItems.filter((item) =>
        isActiveMonth({ item, year: activeYear, month: activeMonth })
    );

    const summary = useMemo(() => calculateMonthlySummary({
        items, year: activeYear, month: activeMonth,
        initialBalance, savingsGoal, referenceYear, referenceMonth,
    }), [items, activeYear, activeMonth, initialBalance, savingsGoal, referenceYear, referenceMonth]);


    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PercentCircle size={18} className="text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 capitalize">
                    {title}
                </h3>
            </div>

            <div className="flex flex-col gap-4">
                <RatioProgressBar
                    label="Tasa de ahorro"
                    percentage={summary.savingsRate}
                    color="#10b981"
                />

                <RatioProgressBar
                    label="Tasa de gasto"
                    percentage={summary.expenseRate}
                    color="#ef4444"
                />
            </div>
        </div>
    )
}
