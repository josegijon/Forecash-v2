import { useMemo } from "react";
import { Target } from "lucide-react";

import { useActiveScenario, usePlanningStore, useScenarioItems, useScenarioStore } from "@/store";
import { GoalProgressRing } from "./GoalProgressRing";
import { calculateMonthlySummary, calculateAccumulatedSavings } from "@core";

interface GoalsProgressCardProps {
    title: string;
}

export const GoalsProgressCard = ({ title }: GoalsProgressCardProps) => {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeMonth = usePlanningStore((s) => s.activeMonth);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const allItems = useScenarioItems(activeScenarioId);
    const activeScenario = useActiveScenario();

    const initialBalance = activeScenario?.initialBalance ?? 0;
    const savingsGoal = activeScenario?.savingsGoal ?? 0;
    const capitalGoal = activeScenario?.capitalGoal ?? 0;

    const summary = useMemo(() => {
        const now = new Date();
        return calculateMonthlySummary({
            items: allItems,
            year: activeYear,
            month: activeMonth,
            initialBalance,
            savingsGoal,
            referenceYear: now.getFullYear(),
            referenceMonth: now.getMonth(),
        });
    }, [allItems, activeYear, activeMonth, initialBalance, savingsGoal]);

    const accumulatedSavings = useMemo(() => {
        const now = new Date();
        return calculateAccumulatedSavings(
            allItems,
            initialBalance,
            now.getFullYear(),
            now.getMonth(),
            activeYear,
            activeMonth,
        );
    }, [allItems, initialBalance, activeYear, activeMonth]);

    const capitalProgress = capitalGoal > 0
        ? Math.round(Math.min((accumulatedSavings / capitalGoal) * 100, 100))
        : 0;

    const isDeficitSavings = summary.netBalance < 0;
    const savingsProgress = isDeficitSavings ? 0 : Math.round(summary.progressGoal * 100);

    const hasSavingsGoal = savingsGoal > 0;
    const hasCapitalGoal = capitalGoal > 0;

    if (!hasSavingsGoal && !hasCapitalGoal) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Target size={18} className="text-emerald-500" />
                    </div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                </div>
                <p className="text-sm text-slate-400 text-center py-4">
                    Define un objetivo de ahorro o de capital para ver tu progreso.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Target size={18} className="text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-900">{title}</h3>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
                {hasSavingsGoal && (
                    <GoalProgressRing
                        progress={savingsProgress}
                        savedAmount={summary.netBalance}
                        goalAmount={savingsGoal}
                        label="Ahorro mensual"
                        color="primary"
                        isDeficit={isDeficitSavings}
                    />
                )}

                {hasCapitalGoal && (
                    <div className={hasSavingsGoal ? "pt-4" : ""}>
                        <GoalProgressRing
                            progress={capitalProgress}
                            savedAmount={accumulatedSavings}
                            goalAmount={capitalGoal}
                            label="Objetivo de capital"
                            color="violet"
                            isDeficit={accumulatedSavings < 0}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};