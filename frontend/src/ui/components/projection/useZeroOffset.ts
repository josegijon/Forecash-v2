import { useMemo } from "react";

/**
 * Calcula el offset fraccional [0,1] donde el balance cruza el cero,
 * para el gradiente split verde/rojo del área chart.
 *
 * - null  → todo positivo (solo verde)
 * - 0     → todo negativo (solo rojo)
 * - 0..1  → split: verde arriba del cero, rojo debajo
 */
export const useZeroOffset = (balances: number[]): number | null => {
    return useMemo(() => {
        if (balances.length === 0) return null;
        const max = Math.max(...balances);
        const min = Math.min(...balances);
        if (min >= 0) return null;
        if (max <= 0) return 0;
        return max / (max - min);
    }, [balances]);
};