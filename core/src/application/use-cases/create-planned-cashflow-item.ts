import { Frequency, ISODateString, toISODateString, addMonths, toISOFirstOfMonth } from "@core/index";
import { assertCashflowItemValid } from "@core/domain/rules/cashflow-invariants";

export interface CreatePlannedCashflowItemInput {
    scenarioId: string;
    type: "income" | "expense";
    name: string;
    amount: number;
    categoryId: string;
    frequency: Frequency;
    /**
     * Offset en meses desde `now` para el inicio del ítem.
     * 0 = mes actual. Debe ser >= 0.
     */
    startsInMonths: number;
    /**
     * Offset en meses desde `now` para el fin del ítem.
     * Debe ser > startsInMonths si se proporciona.
     * No debe existir si frequency === "once".
     */
    endsInMonths?: number;
    /** Fecha de referencia. Por defecto = Date.now(). Inyectable para tests. */
    now?: Date;
}

export interface NewPlannedCashflowItem {
    scenarioId: string;
    type: "income" | "expense";
    name: string;
    amount: number;
    categoryId: string;
    frequency: Frequency;
    startDate: ISODateString;
    endDate?: ISODateString;
}

/**
 * Convierte un offset de meses desde una fecha base al primer día
 * del mes resultante en formato ISODateString.
 * Usa addMonths para evitar overflows de fin de mes.
 */
const offsetToISODate = (base: Date, offsetMonths: number): ISODateString => {
    const yearMonth = { year: base.getFullYear(), month: base.getMonth() };  // ← renombrado
    return toISODateString(toISOFirstOfMonth(addMonths(yearMonth, offsetMonths)));
};

export const createPlannedCashflowItem = (
    input: CreatePlannedCashflowItemInput
): NewPlannedCashflowItem => {
    if (input.startsInMonths < 0) {
        throw new Error(`startsInMonths debe ser >= 0. Recibido: ${input.startsInMonths}`);
    }

    if (input.frequency === "once" && input.endsInMonths !== undefined) {
        throw new Error(`Un ítem con frecuencia "once" no puede tener endsInMonths.`);
    }

    if (input.endsInMonths !== undefined && input.endsInMonths <= input.startsInMonths) {
        throw new Error(
            `endsInMonths (${input.endsInMonths}) debe ser mayor que startsInMonths (${input.startsInMonths}).`
        );
    }

    const now = input.now ?? new Date();
    const startDate = offsetToISODate(now, input.startsInMonths);
    const endDate = input.endsInMonths !== undefined
        ? offsetToISODate(now, input.endsInMonths)
        : undefined;

    const candidate = {
        scenarioId: input.scenarioId,
        type: input.type,
        name: input.name,
        amount: input.amount,
        categoryId: input.categoryId,
        frequency: input.frequency,
        startDate,
        endDate,
    };

    assertCashflowItemValid(candidate);
    return candidate;
};