import { useMemo } from "react";

import { calculateMonthlySummary, isActiveMonth } from "@core";

import { usePlanningStore, useScenarioItems, useScenarioStore, useSettingsStore } from "@/store";

export const useMonthlyRatiosSummary = () => {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeMonth = usePlanningStore((s) => s.activeMonth);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const allItems = useScenarioItems(activeScenarioId);
    const initialBalance = useSettingsStore((s) => s.initialBalance);
    const savingsGoal = useSettingsStore((s) => s.savingsGoal);

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