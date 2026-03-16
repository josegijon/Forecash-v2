import { useMemo } from "react";

import { useCategoryStore, useScenarioItems, useScenarioStore } from "@/store";
import { buildCategoryChartData, type CategoryChartData } from "@/ui/utils/buildCategoryChartData";


export const useCategoryChartData = (
    type: "expense" | "income",
    year: number,
    month: number
): CategoryChartData[] => {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const items = useScenarioItems(activeScenarioId);
    const categories = useCategoryStore((s) => s.categories);

    return useMemo(
        () => buildCategoryChartData({ items, categories, type, year, month }),
        [items, categories, type, year, month]
    );
};