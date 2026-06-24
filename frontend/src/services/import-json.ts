import { AppSnapshotV1Schema, type ValidatedSnapshot } from "@/schemas/snapshot.schema";

const MAX_IMPORT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const VALID_MIME_TYPES = new Set(["", "application/json", "text/json"]);
const MAX_ZOD_ERRORS = 5;

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
