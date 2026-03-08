import { z } from "zod";
import { toISODateString } from "@core";

/* ── Constantes de límites ──────────────────────────────────────────────── */

const MAX_STRING_LENGTH = 500;
const MAX_SCENARIOS = 50;
const MAX_ITEMS_PER_SCENARIO = 1_000;
const MAX_CATEGORIES = 200;

/* ── Primitivos de dominio ──────────────────────────────────────────────── */

export const FrequencySchema = z.enum([
    "once",
    "monthly",
    "bimonthly",
    "quarterly",
    "semiannual",
    "annual",
]);

/**
 * Valida formato YYYY-MM-DD Y que sea una fecha de calendario real.
 * Reconstruye la fecha vía Date.UTC y compara componentes para detectar
 * "roll-over" silencioso (e.g. Feb 30 → Mar 1).
 */
export const ISODateStringSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD")
    .refine(
        (v) => {
            const [y, m, d] = v.split("-").map(Number);
            const date = new Date(Date.UTC(y, m - 1, d));
            return (
                date.getUTCFullYear() === y &&
                date.getUTCMonth() === m - 1 &&
                date.getUTCDate() === d
            );
        },
        { message: "La fecha no es un día de calendario válido" },
    )
    .transform((v) => toISODateString(v));

export const CurrencySchema = z.enum(["EUR", "USD", "GBP"]);

export const ExportedAtSchema = z
    .string()
    .min(1)
    .refine((v) => !isNaN(Date.parse(v)), {
        message: "exportedAt debe ser una fecha/hora ISO válida",
    });

/* ── Entidades ──────────────────────────────────────────────────────────── */

export const CategorySchema = z.object({
    id: z.string().min(1).max(MAX_STRING_LENGTH),
    name: z.string().min(1).max(MAX_STRING_LENGTH),
    type: z.enum(["income", "expense"]),
});

export const ScenarioSchema = z.object({
    id: z.string().min(1).max(MAX_STRING_LENGTH),
    name: z.string().min(1).max(MAX_STRING_LENGTH),
    initialBalance: z.number().finite(),
    savingsGoal: z.number().min(0).finite(),
    cushionBalance: z.number().min(0).finite(),
    capitalGoal: z.number().min(0).finite().optional(),
});

export const CashflowItemSchema = z
    .object({
        id: z.string().min(1).max(MAX_STRING_LENGTH),
        scenarioId: z.string().min(1).max(MAX_STRING_LENGTH),
        type: z.enum(["income", "expense"]),
        name: z.string().min(1).max(MAX_STRING_LENGTH),
        amount: z.number().positive().finite(),
        categoryId: z.string().min(1).max(MAX_STRING_LENGTH),
        frequency: FrequencySchema,
        startDate: ISODateStringSchema,
        endDate: ISODateStringSchema.optional(),
    })
    .refine(
        (item) => !(item.frequency === "once" && item.endDate !== undefined),
        { message: "Un ítem con frecuencia 'once' no puede tener endDate" },
    )
    .refine(
        (item) =>
            item.endDate === undefined || item.endDate >= item.startDate,
        { message: "endDate debe ser posterior o igual a startDate" },
    );

/* ── Snapshot ───────────────────────────────────────────────────────────── */

export const AppSnapshotV1Schema = z
    .object({
        version: z.literal(1),
        exportedAt: ExportedAtSchema,
        scenarios: z.array(ScenarioSchema).min(1).max(MAX_SCENARIOS),
        items: z.record(
            z.string(),
            z.array(CashflowItemSchema).max(MAX_ITEMS_PER_SCENARIO),
        ),
        categories: z.array(CategorySchema).max(MAX_CATEGORIES),
        currency: CurrencySchema.optional(),
    })
    .superRefine((snap, ctx) => {
        const scenarioIds = new Set(snap.scenarios.map((s) => s.id));
        const categoryIds = new Set(snap.categories.map((c) => c.id));

        // Cada clave de items debe corresponder a un escenario existente
        for (const key of Object.keys(snap.items)) {
            if (!scenarioIds.has(key)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["items", key],
                    message: `La clave de items "${key}" no corresponde a ningún escenario`,
                });
            }
        }

        // Cada item debe referenciar su escenario y una categoría existente
        for (const [scenarioId, items] of Object.entries(snap.items)) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item.scenarioId !== scenarioId) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["items", scenarioId, i, "scenarioId"],
                        message: `scenarioId "${item.scenarioId}" no coincide con la clave "${scenarioId}"`,
                    });
                }

                if (!categoryIds.has(item.categoryId)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["items", scenarioId, i, "categoryId"],
                        message: `categoryId "${item.categoryId}" no existe en categories`,
                    });
                }
            }
        }
    });

/* ── Tipos inferidos ────────────────────────────────────────────────────── */

export type ValidatedSnapshot = z.infer<typeof AppSnapshotV1Schema>;
export type ValidatedCashflowItem = z.infer<typeof CashflowItemSchema>;
export type ValidatedScenario = z.infer<typeof ScenarioSchema>;