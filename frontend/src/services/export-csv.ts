import type { CashflowItem, Category, Scenario } from "@/store";
import { dateTag, triggerDownload } from "./export-helpers";

const CSV_INJECTION_PREFIXES = new Set(["=", "+", "-", "@", "\t", "\r"]);

const csvCell = (value: string): string => {
    let sanitized = value.replace(/"/g, '""');

    if (sanitized.length > 0 && CSV_INJECTION_PREFIXES.has(sanitized[0])) {
        sanitized = `'${sanitized}`;
    }

    return `"${sanitized}"`;
};

export const exportToCsv = (scenarios: Scenario[], items: Record<string, CashflowItem[]>, categories: Category[]): void => {
    const headers = [
        "Escenario",
        "ID",
        "Tipo",
        "Nombre",
        "Importe",
        "Frecuencia",
        "Categoría",
        "Fecha inicio",
        "Fecha fin",
    ];

    const rows: string[][] = [];

    const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

    for (const scenario of scenarios) {
        const scenarioItems = items[scenario.id] ?? [];
        for (const item of scenarioItems) {
            rows.push([
                scenario.name,
                item.id,
                item.type,
                item.name,
                String(item.amount),
                item.frequency,
                categoryNameById.get(item.categoryId) ?? "Sin categoría",
                item.startDate ?? "",
                item.endDate ?? "",
            ]);
        }
    }

    const csv = [headers, ...rows]
        .map((row) => row.map(csvCell).join(","))
        .join("\r\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, `forecash-export-${dateTag()}.csv`);
};
