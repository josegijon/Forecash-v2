import { Frequency } from "./frequency";

/**
 * Fecha en formato ISO 8601: "YYYY-MM-DD".
 * El dominio asume siempre UTC day-precision (sin hora).
 */
export type ISODateString = string & { readonly __brand: 'ISODateString' };

/**
 * Convierte un string a ISODateString tras validación básica.
 * Lanza si el formato es inválido.
 */
export const toISODateString = (value: string): ISODateString => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`Fecha inválida: "${value}". Se esperaba formato YYYY-MM-DD.`);
    }
    return value as ISODateString;
};

/**
 * Ítem de cashflow planificado.
 *
 * Invariantes:
 *  - amount > 0 (el signo lo da `type`)
 *  - startDate <= endDate (si endDate existe)
 *  - frequency "once" NO debe tener endDate
 *  - categoryId no vacío
 */
export interface CashflowItem {
    readonly id: string;
    readonly scenarioId: string;
    readonly type: "income" | "expense";
    readonly name: string;
    /** Siempre positivo. El signo semántico lo aporta `type`. */
    readonly amount: number;
    readonly categoryId: string;
    readonly frequency: Frequency;
    /** Primer mes en que el ítem es activo. Formato: YYYY-MM-DD */
    readonly startDate: ISODateString;
    /**
     * Último mes en que el ítem es activo (inclusive).
     * Indefinido = sin fecha de fin (ítem recurrente indefinido).
     * No debe existir si frequency === "once".
     */
    readonly endDate?: ISODateString;
}