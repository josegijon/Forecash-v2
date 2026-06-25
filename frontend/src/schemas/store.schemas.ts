import { z } from "zod";
import { CurrencySchema, FinancialAmountSchema, FrequencySchema, IdSchema, ISODateStringSchema, ItemTypeSchema, NameSchema } from "./primitives";

const MAX_SCENARIOS = 50;
const MAX_FINANCIAL_AMOUNT = 999_999_999;
const MAX_ITEMS_PER_SCENARIO = 1_000;
const MAX_CATEGORIES = 200;

/* ── CashflowStore ──────────────────────────────────────────────────────── */

const PersistedCashflowItemSchema = z
    .object({
        id: IdSchema,
        scenarioId: IdSchema,
        type: ItemTypeSchema,
        name: NameSchema,
        amount: FinancialAmountSchema.max(MAX_FINANCIAL_AMOUNT),
        categoryId: IdSchema,
        frequency: FrequencySchema,
        startDate: ISODateStringSchema,
        endDate: ISODateStringSchema.optional(),
    })
    .strict()
    .refine(
        (item) => !(item.frequency === "once" && item.endDate !== undefined),
        { message: "Un ítem con frecuencia 'once' no puede tener endDate" },
    )
    .refine(
        (item) => item.endDate === undefined || item.endDate >= item.startDate,
        { message: "endDate debe ser posterior o igual a startDate" },
    );

export const CashflowPersistedSchema = z
    .object({
        items: z.record(z.string(), z.array(PersistedCashflowItemSchema).max(MAX_ITEMS_PER_SCENARIO)),
    })
    .strict()
    .superRefine((val, ctx) => {
        if (Object.keys(val.items).length > MAX_SCENARIOS) {
            ctx.addIssue({
                code: "custom",
                message: `items no puede tener más de ${MAX_SCENARIOS} escenarios`,
            });
        }
    });

/* ── CategoryStore ──────────────────────────────────────────────────────── */

const PersistedCategorySchema = z.object({
    id: IdSchema,
    name: NameSchema,
    type: ItemTypeSchema,
}).strict();

export const CategoryPersistedSchema = z.object({
    categories: z.array(PersistedCategorySchema).max(MAX_CATEGORIES),
}).strict();

/* ── ScenarioStore ──────────────────────────────────────────────────────── */

const PersistedScenarioSchema = z.object({
    id: IdSchema,
    name: NameSchema,
    initialBalance: z.number().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER),
    savingsGoal: z.number().min(0).max(MAX_FINANCIAL_AMOUNT),
    cushionBalance: z.number().min(0).max(MAX_FINANCIAL_AMOUNT),
    capitalGoal: z.number().min(0).max(MAX_FINANCIAL_AMOUNT).optional(),
}).strict();

export const ScenarioPersistedSchema = z
    .object({
        scenarios: z.array(PersistedScenarioSchema).min(1).max(MAX_SCENARIOS),
        activeScenarioId: IdSchema,
    })
    .superRefine((snap, ctx) => {
        const scenarioIds = new Set(snap.scenarios.map((s) => s.id));

        if (!scenarioIds.has(snap.activeScenarioId)) {
            ctx.addIssue({
                code: "custom",
                path: ["activeScenarioId"],
                message: `activeScenarioId "${snap.activeScenarioId}" no existe en scenarios`,
            });
        }
    })
    .strict();

/* ── SettingsStore ──────────────────────────────────────────────────────── */

export const ThemeSchema = z.enum(["light", "dark"]);

export const SettingsPersistedSchema = z.object({
    currency: CurrencySchema,
    theme: ThemeSchema,
}).strict();
