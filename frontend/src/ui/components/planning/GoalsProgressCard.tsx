import { useMemo } from "react";
import { Target } from "lucide-react";

import { calculateMonthlySummary } from "@core";

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


    const capitalProgress = capitalGoal > 0
        ? Math.round(Math.min((summary.accumulatedSavings / capitalGoal) * 100, 100))
        : 0;

    const isDeficitSavings = summary.netBalance < 0;
    const savingsProgress =
        isDeficitSavings || savingsGoal === 0
            ? 0
            : Math.round(Math.min((summary.netBalance / savingsGoal) * 100, 100));

    const hasSavingsGoal = savingsGoal > 0;
    const hasCapitalGoal = capitalGoal > 0;
    const hasBothGoals = hasSavingsGoal && hasCapitalGoal;

    return (
        <div className="flex flex-col gap-5 rounded-3xl border-0 text-card-foreground bg-transparent shadow-none p-0">
            <div className="flex items-center">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    {title}
                </h3>
            </div>

            {!hasSavingsGoal && !hasCapitalGoal ? (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                    <Target size={22} className="text-muted-foreground/60" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground">
                        Define un objetivo de ahorro o de capital en la sección <span className="font-medium text-foreground">Saldo y metas</span> para ver tu progreso aquí.
                    </p>
                </div>
            ) : (
                <div
                    className={hasBothGoals
                        ? "grid grid-cols-2 items-baseline gap-6"
                        : "grid grid-cols-1 items-baseline gap-6"}
                >
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
                        <GoalProgressRing
                            progress={capitalProgress}
                            savedAmount={summary.accumulatedSavings}
                            goalAmount={capitalGoal}
                            label="Objetivo de capital"
                            color="violet"
                            isDeficit={summary.accumulatedSavings < 0}
                        />
                    )}
                </div>
            )}
        </div>
    );
};