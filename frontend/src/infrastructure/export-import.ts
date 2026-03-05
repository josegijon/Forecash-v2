import type { Scenario } from "@/store/scenarioStore";
import type { CashflowItem } from "@/store/cashflowStore";

import type { AppSnapshotV1 } from "@core";

/* ── JSON ── */
export const exportToJson = (snapshot: AppSnapshotV1): void => {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json",
    });
    triggerDownload(blob, `forecash-export-${dateTag()}.json`);
};

export const importFromJson = (file: File): Promise<AppSnapshotV1> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string) as AppSnapshotV1;
                resolve(data);
            } catch {
                reject(new Error("El archivo no es un JSON válido."));
            }
        };
        reader.onerror = () => reject(new Error("Error al leer el archivo."));
        reader.readAsText(file);
    });

/* ── CSV ── */
export const exportToCsv = (
    scenarios: Scenario[],
    items: Record<string, CashflowItem[]>
): void => {
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
                item.categoryId ?? "",
                item.startDate ?? "",
                item.endDate ?? "",
            ]);
        }
    }

    const csv = [headers, ...rows]
        .map((row) => row.map(csvCell).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, `forecash-export-${dateTag()}.csv`);
};

/* ── Helpers ── */
const csvCell = (value: string) =>
    `"${value.replace(/"/g, '""')}"`;

const dateTag = () =>
    new Date().toISOString().slice(0, 10);

const triggerDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
};