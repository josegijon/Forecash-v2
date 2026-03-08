import { useMemo, useState } from "react";

import { calculateMonthlySummary, isActiveMonth } from "@core";

import { useActiveScenario, useCashflowStore, useCategoryStore, useCurrencySymbol, usePlanningStore, useScenarioItems, useScenarioStore } from "@/store";

type FilterType = "all" | "income" | "expense";

const FILTER_TABS: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "income", label: "Ingresos" },
    { key: "expense", label: "Gastos" },
];

export const useCashflowItemListModel = () => {
    const [filter, setFilter] = useState<FilterType>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeScenario = useActiveScenario();
    const activeMonth = usePlanningStore((s) => s.activeMonth);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const allItems = useScenarioItems(activeScenarioId);
    const removeItem = useCashflowStore((s) => s.removeItem);
    const categories = useCategoryStore((s) => s.categories);
    const currencySymbol = useCurrencySymbol();
    const initialBalance = activeScenario?.initialBalance ?? 0;
    const savingsGoal = activeScenario?.savingsGoal ?? 0;

    const categoryNameById = useMemo(() => {
        const map = new Map<string, string>();
        categories.forEach((c) => map.set(c.id, c.name));
        return map;
    }, [categories]);

    const getCategoryName = (categoryId: string) => categoryNameById.get(categoryId) ?? "Sin categoría";

    const activeItems = useMemo(
        () => allItems.filter((item) => isActiveMonth({ item, year: activeYear, month: activeMonth })),
        [allItems, activeYear, activeMonth]
    );

    const filteredItems = useMemo(
        () =>
            activeItems
                .filter((item) => filter === "all" || item.type === filter)
                .filter((item) => {
                    const query = searchQuery.toLowerCase();
                    return (
                        item.name.toLowerCase().includes(query) ||
                        getCategoryName(item.categoryId).toLowerCase().includes(query)
                    );
                }),
        [activeItems, filter, searchQuery, categoryNameById]
    );

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

    const onDeleteItem = (itemId: string) => removeItem(itemId, activeScenarioId);

    return {
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        filteredItems,
        summary,
        currencySymbol,
        filterTabs: FILTER_TABS,
        getCategoryName,
        onDeleteItem,
    };
};