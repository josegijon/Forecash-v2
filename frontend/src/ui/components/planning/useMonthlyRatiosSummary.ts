import { useMemo } from "react";

import { calculateMonthlySummary } from "@core";

import { useActiveScenario, usePlanningStore, useScenarioItems, useScenarioStore } from "@/store";

export const useMonthlyRatiosSummary = () => {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeScenario = useActiveScenario();
    const activeMonth = usePlanningStore((s) => s.activeMonth);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const items = useScenarioItems(activeScenarioId);
    const initialBalance = activeScenario?.initialBalance ?? 0;
    const savingsGoal = activeScenario?.savingsGoal ?? 0;

    return useMemo(() => {
        const now = new Date();
        return calculateMonthlySummary({
            items,
            year: activeYear,
            month: activeMonth,
            initialBalance,
            savingsGoal,
            referenceYear: now.getFullYear(),
            referenceMonth: now.getMonth(),
        });
    }, [items, activeYear, activeMonth, initialBalance, savingsGoal]);
};