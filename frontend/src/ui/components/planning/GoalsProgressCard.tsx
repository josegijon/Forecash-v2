import { useMemo } from "react";
import { Target } from "lucide-react";

import { calculateAccumulatedSavings, calculateMonthlySummary } from "@core";

import { useActiveScenario, usePlanningStore, useScenarioItems, useScenarioStore } from "@/store";
import { GoalProgressRing } from "./GoalProgressRing";

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

    return (
        <div className="rounded-3xl border-0 text-card-foreground bg-transparent shadow-none p-0">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    {title}
                </h3>
            </div>

            {!hasSavingsGoal && !hasCapitalGoal ? (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                    <Target size={22} className="text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                        Define un objetivo de ahorro o de capital para ver tu progreso.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 items-baseline gap-4">
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
            )}
        </div>
    );
};