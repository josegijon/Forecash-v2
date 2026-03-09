import type { z } from "zod";
import type { PersistOptions } from "zustand/middleware";

/**
 * Crea una función `merge` para zustand `persist` que valida el estado
 * rehidratado contra un schema Zod. Si la validación falla, descarta
 * los datos corruptos y usa el estado por defecto.
 *
 * En desarrollo, loguea el error para facilitar depuración.
 */
export const createValidatedMerge = <TState extends object>(
    schema: z.ZodType,
    storeName: string,
): NonNullable<PersistOptions<TState>["merge"]> => {
    return (persisted, currentState) => {
        if (persisted === undefined || persisted === null) {
            return currentState;
        }

        const result = schema.safeParse(persisted);

        if (!result.success) {
            if (import.meta.env.DEV) {
                console.warn(
                    `[${storeName}] Datos de localStorage inválidos, usando defaults.`,
                    result.error.issues,
                );
            }
            return currentState;
        }

        return { ...currentState, ...(result.data as Partial<TState>) };
    };
};