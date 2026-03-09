import { z } from "zod";
import { FrequencySchema, CurrencySchema, ISODateStringSchema } from "./snapshot.schema";

/* ── CashflowStore ──────────────────────────────────────────────────────── */

const PersistedCashflowItemSchema = z.object({
    id: z.string().min(1),
    scenarioId: z.string().min(1),
    type: z.enum(["income", "expense"]),
    name: z.string().min(1),
    amount: z.number().positive().finite(),
    categoryId: z.string().min(1),
    frequency: FrequencySchema,
    startDate: ISODateStringSchema,
    endDate: ISODateStringSchema.optional(),
});

export const CashflowPersistedSchema = z.object({
    items: z.record(z.string(), z.array(PersistedCashflowItemSchema)),
});

/* ── CategoryStore ──────────────────────────────────────────────────────── */

const PersistedCategorySchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(["income", "expense"]),
});

export const CategoryPersistedSchema = z.object({
    categories: z.array(PersistedCategorySchema),
});

/* ── ScenarioStore ──────────────────────────────────────────────────────── */

const PersistedScenarioSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    initialBalance: z.number().finite(),
    savingsGoal: z.number().min(0).finite(),
    cushionBalance: z.number().min(0).finite(),
    capitalGoal: z.number().min(0).finite().optional(),
});

export const ScenarioPersistedSchema = z.object({
    scenarios: z.array(PersistedScenarioSchema).min(1),
    activeScenarioId: z.string().min(1),
});

/* ── SettingsStore ──────────────────────────────────────────────────────── */

export const ThemeSchema = z.enum(["light", "dark"]);

export const SettingsPersistedSchema = z.object({
    currency: CurrencySchema,
    theme: ThemeSchema,
});