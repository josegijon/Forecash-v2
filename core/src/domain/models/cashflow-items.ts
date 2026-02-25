import { Frequency } from "./frequency";

export interface CashflowItem {
    id: string;
    scenarioId: string;
    type: "income" | "expense";
    name: string;
    amount: number;
    categoryId: string;
    frequency: Frequency;
    startDate: string;
    endDate?: string;
}