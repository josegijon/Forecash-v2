import type { Scenario } from "@/store/scenarioStore";
import type { CashflowItem } from "@/store/cashflowStore";
import {
    AppSnapshotV1Schema,
    type ValidatedSnapshot,
} from "@/schemas/snapshot.schema";
import type { Category } from "@/store";

/* ── Constantes ─────────────────────────────────────────────────────────── */

const MAX_IMPORT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_ZOD_ERRORS = 5;
const REVOKE_URL_DELAY_MS = 1000;
const VALID_MIME_TYPES = new Set(["", "application/json", "text/json"]);

/* ── Tipos de error explícitos ──────────────────────────────────────────── */

export type ImportErrorKind =
    | "FILE_TOO_LARGE"
    | "INVALID_FILE_TYPE"
    | "EMPTY_FILE"
    | "NOT_VALID_JSON"
    | "SCHEMA_VALIDATION_FAILED"
    | "READ_ERROR"
    | "ABORTED";

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

const readFileAsText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const raw = e.target?.result;
            if (typeof raw !== "string" || raw.trim() === "") {
                return reject(new ImportError("EMPTY_FILE", "El archivo está vacío."));
            }
            resolve(raw);
        };
        reader.onerror = () => reject(new ImportError("READ_ERROR", "Error al leer el archivo."));
        reader.onabort = () => reject(new ImportError("ABORTED", "La lectura del archivo fue cancelada."));
        reader.readAsText(file);
    });

const parseJsonText = (raw: string): unknown => {
    try {
        return JSON.parse(raw);
    } catch {
        throw new ImportError("NOT_VALID_JSON", "El archivo no contiene JSON válido.");
    }
};

const validateSnapshot = (parsed: unknown): ValidatedSnapshot => {
    const result = AppSnapshotV1Schema.safeParse(parsed);
    if (!result.success) {
        const details = result.error.issues
            .slice(0, MAX_ZOD_ERRORS)
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; ");
        throw new ImportError(
            "SCHEMA_VALIDATION_FAILED",
            "El archivo no tiene el formato esperado de Forecash.",
            details,
        );
    }
    return result.data;
};

export const importFromJson = async (file: File): Promise<ValidatedSnapshot> => {
    if (file.size === 0)
        throw new ImportError("EMPTY_FILE", "El archivo está vacío.");

    if (file.size > MAX_IMPORT_SIZE_BYTES)
        throw new ImportError("FILE_TOO_LARGE", `El archivo supera el límite de ${MAX_IMPORT_SIZE_BYTES / 1024 / 1024} MB.`);

    const hasValidExtension = file.name.toLowerCase().endsWith(".json");
    const hasValidMime = VALID_MIME_TYPES.has(file.type);
    if (!hasValidExtension || !hasValidMime)
        throw new ImportError("INVALID_FILE_TYPE", "Solo se admiten archivos .json.");

    const raw = await readFileAsText(file);
    const parsed = parseJsonText(raw);
    return validateSnapshot(parsed);
};

/* ── CSV export ─────────────────────────────────────────────────────────── */

/**
 * Caracteres que inician una fórmula en hojas de cálculo.
 * Prefijamos con comilla simple para neutralizar CSV injection (OWASP).
 */
const CSV_INJECTION_PREFIXES = new Set(["=", "+", "-", "@", "\t", "\r"]);

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

/* ── Helpers ────────────────────────────────────────────────────────────── */

const csvCell = (value: string): string => {
    let sanitized = value.replace(/"/g, '""');

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
    setTimeout(() => URL.revokeObjectURL(url), REVOKE_URL_DELAY_MS);
};
