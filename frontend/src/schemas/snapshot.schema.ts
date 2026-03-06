import { z } from "zod";
import { toISODateString } from "@core";

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
 * Ejemplo inválido que supera sólo el regex: "2024-02-30".
 */
export const ISODateStringSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD")
    .refine((v) => !isNaN(Date.parse(v)), {
        message: "La fecha no es un día de calendario válido",
    })
    .transform((v) => toISODateString(v));

export const CurrencySchema = z.enum(["EUR", "USD", "GBP"]);

/* ── Entidades ──────────────────────────────────────────────────────────── */

export const CategorySchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(["income", "expense"]),
});

export const ScenarioSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    /** Puede ser negativo (deuda inicial) */
    initialBalance: z.number().finite(),
    savingsGoal: z.number().min(0).finite(),
    cushionBalance: z.number().min(0).finite(),
    capitalGoal: z.number().min(0).finite().optional(),
});

export const CashflowItemSchema = z
    .object({
        id: z.string().min(1),
        scenarioId: z.string().min(1),
        type: z.enum(["income", "expense"]),
        name: z.string().min(1),
        /** Siempre positivo; el signo lo aporta `type` */
        amount: z.number().positive().finite(),
        categoryId: z.string().min(1),
        frequency: FrequencySchema,
        startDate: ISODateStringSchema,
        endDate: ISODateStringSchema.optional(),
    })
    /** Invariante del dominio: "once" no puede tener endDate */
    .refine(
        (item) => !(item.frequency === "once" && item.endDate !== undefined),
        { message: "Un ítem con frecuencia 'once' no puede tener endDate" }
    )
    /** Invariante del dominio: endDate >= startDate */
    .refine(
        (item) =>
            item.endDate === undefined || item.endDate >= item.startDate,
        { message: "endDate debe ser posterior o igual a startDate" }
    );

/* ── Snapshot ───────────────────────────────────────────────────────────── */

export const AppSnapshotV1Schema = z.object({
    /** Literal 1 — rechaza snapshots de versiones incompatibles */
    version: z.literal(1),
    exportedAt: z.string().min(1),
    scenarios: z.array(ScenarioSchema),
    items: z.record(z.string(), z.array(CashflowItemSchema)),
    categories: z.array(CategorySchema),
    currency: CurrencySchema.optional(),
});

/* ── Tipos inferidos (para narrowing tras parse) ────────────────────────── */

export type ValidatedSnapshot = z.infer<typeof AppSnapshotV1Schema>;
export type ValidatedCashflowItem = z.infer<typeof CashflowItemSchema>;
export type ValidatedScenario = z.infer<typeof ScenarioSchema>;