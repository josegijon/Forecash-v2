import type { Scenario } from "@/store/scenarioStore";
import type { CashflowItem } from "@/store/cashflowStore";
import {
    AppSnapshotV1Schema,
    type ValidatedSnapshot,
} from "@/schemas/snapshot.schema";

/* ── Constantes ─────────────────────────────────────────────────────────── */

const MAX_IMPORT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/* ── Tipos de error explícitos ──────────────────────────────────────────── */

export type ImportErrorKind =
    | "FILE_TOO_LARGE"
    | "INVALID_FILE_TYPE"
    | "EMPTY_FILE"
    | "NOT_VALID_JSON"
    | "SCHEMA_VALIDATION_FAILED"
    | "READ_ERROR";

export class ImportError extends Error {
    public readonly kind: ImportErrorKind;
    public readonly details?: string;

    constructor(kind: ImportErrorKind, message: string, details?: string) {
        super(message);
        this.kind = kind;
        this.details = details;
        this.name = "ImportError";
    }
}

/* ── JSON export ────────────────────────────────────────────────────────── */

export const exportToJson = (snapshot: ValidatedSnapshot): void => {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json",
    });
    triggerDownload(blob, `forecash-export-${dateTag()}.json`);
};

/* ── JSON import ────────────────────────────────────────────────────────── */

export const importFromJson = (file: File): Promise<ValidatedSnapshot> =>
    new Promise((resolve, reject) => {
        if (file.size === 0) {
            return reject(
                new ImportError("EMPTY_FILE", "El archivo está vacío."),
            );
        }

        if (file.size > MAX_IMPORT_SIZE_BYTES) {
            return reject(
                new ImportError(
                    "FILE_TOO_LARGE",
                    `El archivo supera el límite de ${MAX_IMPORT_SIZE_BYTES / 1024 / 1024} MB.`,
                ),
            );
        }

        const hasValidExtension = file.name.toLowerCase().endsWith(".json");
        const hasValidMime =
            file.type === "" ||
            file.type === "application/json" ||
            file.type === "text/json";

        if (!hasValidExtension || !hasValidMime) {
            return reject(
                new ImportError(
                    "INVALID_FILE_TYPE",
                    "Solo se admiten archivos .json.",
                ),
            );
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const raw = e.target?.result;

            if (typeof raw !== "string" || raw.trim() === "") {
                return reject(
                    new ImportError("EMPTY_FILE", "El archivo está vacío."),
                );
            }

            let parsed: unknown;
            try {
                parsed = JSON.parse(raw);
            } catch {
                return reject(
                    new ImportError(
                        "NOT_VALID_JSON",
                        "El archivo no contiene JSON válido.",
                    ),
                );
            }

            // Validación estructural + integridad referencial con Zod
            const result = AppSnapshotV1Schema.safeParse(parsed);

            if (!result.success) {
                const details = result.error.issues
                    .slice(0, 5)
                    .map((i) => `${i.path.join(".")}: ${i.message}`)
                    .join("; ");

                return reject(
                    new ImportError(
                        "SCHEMA_VALIDATION_FAILED",
                        "El archivo no tiene el formato esperado de Forecash.",
                        details,
                    ),
                );
            }

            resolve(result.data);
        };

        reader.onerror = () =>
            reject(
                new ImportError("READ_ERROR", "Error al leer el archivo."),
            );

        reader.readAsText(file);
    });

/* ── CSV export ─────────────────────────────────────────────────────────── */

/**
 * Caracteres que inician una fórmula en hojas de cálculo.
 * Prefijamos con comilla simple para neutralizar CSV injection (OWASP).
 */
const CSV_INJECTION_PREFIXES = new Set(["=", "+", "-", "@", "\t", "\r"]);

export const exportToCsv = (
    scenarios: Scenario[],
    items: Record<string, CashflowItem[]>,
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
        .join("\r\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, `forecash-export-${dateTag()}.csv`);
};

/* ── Helpers ────────────────────────────────────────────────────────────── */

/**
 * Envuelve el valor en comillas dobles, escapando comillas internas,
 * eliminando saltos de línea y neutralizando CSV injection.
 */
const csvCell = (value: string): string => {
    let sanitized = value.replace(/"/g, '""').replace(/[\r\n]+/g, " ");

    // Neutralizar CSV injection: prefijo con comilla simple
    if (sanitized.length > 0 && CSV_INJECTION_PREFIXES.has(sanitized[0])) {
        sanitized = `'${sanitized}`;
    }

    return `"${sanitized}"`;
};

const dateTag = (): string => new Date().toISOString().slice(0, 10);

const triggerDownload = (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};