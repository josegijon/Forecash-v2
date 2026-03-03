import { useMemo } from "react";

import { calculateMonthlySummary, isActiveMonth } from "@core";

import { useActiveScenario, usePlanningStore, useScenarioItems, useScenarioStore } from "@/store";

export const useMonthlyRatiosSummary = () => {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeScenario = useActiveScenario();
    const activeMonth = usePlanningStore((s) => s.activeMonth);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const allItems = useScenarioItems(activeScenarioId);
    const initialBalance = activeScenario?.initialBalance ?? 0;
    const savingsGoal = activeScenario?.savingsGoal ?? 0;

    const now = new Date();
    const referenceMonth = now.getMonth();
    const referenceYear = now.getFullYear();

    return useMemo(() => {
        const items = allItems.filter((item) =>
            isActiveMonth({ item, year: activeYear, month: activeMonth })
        );

        return calculateMonthlySummary({
            items,
            year: activeYear,
            month: activeMonth,
            initialBalance,
            savingsGoal,
            referenceYear,
            referenceMonth,
        });
    }, [
        allItems,
        activeYear,
        activeMonth,
        initialBalance,
        savingsGoal,
        referenceYear,
        referenceMonth,
    ]);
};