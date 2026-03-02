import { Frequency } from "@core/index";

export interface CreatePlannedCashflowItemInput {
    scenarioId: string;
    type: "income" | "expense";
    name: string;
    amount: number;
    categoryId: string;
    frequency: Frequency;
    startsInMonths: number;
    endsInMonths?: number;
    now?: Date;
}

export interface NewPlannedCashflowItem {
    scenarioId: string;
    type: "income" | "expense";
    name: string;
    amount: number;
    categoryId: string;
    frequency: Frequency;
    startDate: string;
    endDate?: string;
}

const toISODate = (date: Date) => date.toISOString().slice(0, 10);

export const createPlannedCashflowItem = (input: CreatePlannedCashflowItemInput): NewPlannedCashflowItem => {
    const start = new Date(input.now ?? new Date());
    start.setMonth(start.getMonth() + input.startsInMonths);

    let endDate: string | undefined = undefined;

    // Si se proporcionó "endsInMonths", calcular la fecha de finalización
    if (input.endsInMonths !== undefined) {
        const end = new Date(input.now ?? new Date());
        end.setMonth(end.getMonth() + input.endsInMonths);
        endDate = toISODate(end);
    }

    return {
        scenarioId: input.scenarioId,
        type: input.type,
        name: input.name,
        amount: input.amount,
        categoryId: input.categoryId,
        frequency: input.frequency,
        startDate: toISODate(start),
        endDate,
    };
};