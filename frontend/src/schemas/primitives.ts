import { z } from "zod";
import { toISODateString } from "@core";

export const ItemTypeSchema = z.enum(["income", "expense"]);

export const IdSchema = z.string().min(1);

export const NameSchema = z.string().min(1);

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
