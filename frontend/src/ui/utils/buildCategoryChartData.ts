import { isActiveMonth } from "@core";
import type { CashflowItem, SnapshotCategory as Category } from "@core";

export interface CategoryChartData {
    name: string;
    value: number;
    fill: string;
}

// Colores con máxima distancia perceptual entre sí:
// - Ningún par comparte tono cercano
// - Alternancia entre saturados y más apagados para mayor contraste visual
// - Evita: indigo+violeta juntos, verde+teal juntos, dos azules
export const CATEGORY_COLORS = [
    "#f59e0b", // amber
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // emerald
    "#ec4899", // pink
    "#f97316", // orange
    "#6366f1", // indigo
    "#84cc16", // lime
    "#06b6d4", // cyan
    "#8b5cf6", // violet — separado de indigo por 4 posiciones
] as const;

/**
 * Asigna un color estable a una categoría a partir de su ID.
 * Determinista: el mismo ID siempre produce el mismo color,
 * independientemente del orden de los ítems.
 */
const colorForCategory = (categoryId: string): string => {
    let hash = 0;
    for (let i = 0; i < categoryId.length; i++) {
        hash = (hash * 31 + categoryId.charCodeAt(i)) >>> 0;
    }
    return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
};

interface BuildCategoryChartDataInput {
    items: CashflowItem[];
    categories: Category[];
    type: "expense" | "income";
    year: number;
    month: number;
}

/**
 * Función pura: transforma ítems + categorías en datos para el gráfico de dona.
 * Filtra por tipo y mes activo. El color es estable por categoryId.
 */
export const buildCategoryChartData = ({
    items,
    categories,
    type,
    year,
    month,
}: BuildCategoryChartDataInput): CategoryChartData[] => {
    const filteredItems = items.filter(
        (item) => item.type === type && isActiveMonth({ item, year, month })
    );

    const categoryMap = new Map<string, number>();
    for (const item of filteredItems) {
        const current = categoryMap.get(item.categoryId) ?? 0;
        categoryMap.set(item.categoryId, current + item.amount);
    }

    const data: CategoryChartData[] = [];
    for (const [categoryId, total] of categoryMap) {
        const cat = categories.find((c) => c.id === categoryId);
        data.push({
            name: cat?.name ?? "Sin categoría",
            value: total,
            fill: colorForCategory(categoryId),
        });
    }

    data.sort((a, b) => b.value - a.value);

    return data;
};