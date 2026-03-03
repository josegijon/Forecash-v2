import { useMemo, useState } from "react";

import { calculateMonthlySummary, isActiveMonth } from "@core";

import { useActiveScenario, useCashflowStore, useCategoryStore, useCurrencySymbol, usePlanningStore, useScenarioItems, useScenarioStore } from "@/store";

type FilterType = "all" | "income" | "expense";

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

    const now = new Date();
    const referenceMonth = now.getMonth();
    const referenceYear = now.getFullYear();

    // Map de categorías para acceso rápido
    const categoryNameById = useMemo(() => {
        const map = new Map<string, string>();
        categories.forEach((c) => map.set(c.id, c.name));
        return map;
    }, [categories]);

    const getCategoryName = (categoryId: string) => categoryNameById.get(categoryId) ?? "Sin categoría";

    // Filtrar solo los ítems activos en el mes actual
    const items = useMemo(
        () => allItems.filter((item) => isActiveMonth({ item, year: activeYear, month: activeMonth })),
        [allItems, activeYear, activeMonth]
    );

    // Aplicar filtros de tipo y búsqueda
    const filteredItems = useMemo(
        () =>
            items
                .filter((item) => filter === "all" || item.type === filter)
                .filter((item) => {
                    const query = searchQuery.toLowerCase();
                    return (
                        item.name.toLowerCase().includes(query) ||
                        getCategoryName(item.categoryId).toLowerCase().includes(query)
                    );
                }),
        [items, filter, searchQuery, categoryNameById]
    );

    // Resumen mensual
    const summary = useMemo(
        () =>
            calculateMonthlySummary({
                items,
                year: activeYear,
                month: activeMonth,
                initialBalance,
                savingsGoal,
                referenceYear,
                referenceMonth,
            }),
        [items, activeYear, activeMonth, initialBalance, savingsGoal, referenceYear, referenceMonth]
    );

    // Opciones de filtro para la UI
    const filterTabs: { key: FilterType; label: string }[] = [
        { key: "all", label: "Todos" },
        { key: "income", label: "Ingresos" },
        { key: "expense", label: "Gastos" },
    ];

    const onDeleteItem = (itemId: string) => removeItem(itemId, activeScenarioId);

    return {
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        filteredItems,
        summary,
        currencySymbol,
        filterTabs,
        getCategoryName,
        onDeleteItem,
    };
}
