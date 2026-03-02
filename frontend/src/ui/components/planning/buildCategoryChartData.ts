import { isActiveMonth } from "@core"

import type { CashflowItem, Category } from "@/store"

export interface CategoryChartData {
    name: string
    value: number
    fill: string
}

//? Que pasa si hay más categorías que colores? Se repiten o se generan nuevos colores? Por ahora se repiten, pero podría ser buena idea generar nuevos colores dinámicamente si se supera el límite
export const CATEGORY_COLORS = [
    "#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#ec4899",
    "#ef4444", "#8b5cf6", "#14b8a6", "#f97316", "#06b6d4",
] as const

interface BuildCategoryChartDataInput {
    items: CashflowItem[]
    categories: Category[]
    type: "expense" | "income"
    year: number
    month: number
}

// Función pura para construir los datos del gráfico de categorías a partir de los items y categorías, filtrando por tipo y mes activo
export const buildCategoryChartData = ({ items, categories, type, year, month }: BuildCategoryChartDataInput): CategoryChartData[] => {
    const filteredItems = items.filter(
        (item) => item.type === type && isActiveMonth({ item, year, month })
    );

    const categoryMap = new Map<string, number>();
    for (const item of filteredItems) {
        const current = categoryMap.get(item.categoryId) ?? 0
        categoryMap.set(item.categoryId, current + item.amount)
    };

    const data: CategoryChartData[] = [];
    let colorIndex = 0;
    for (const [categoryId, total] of categoryMap) {
        const cat = categories.find((c) => c.id === categoryId)
        data.push({
            name: cat?.name ?? "Sin categoría",
            value: total,
            fill: CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length],
        })
        colorIndex++
    };

    data.sort((a, b) => b.value - a.value);

    return data;
}
