export type CrossType = "gained" | "lost";

export interface CrossEvent {
    /** Índice en la serie de datos donde ocurre el cruce. */
    index: number;
    type: CrossType;
}

export interface DetectBalanceCrossesInput {
    /** Serie de balances ordenada cronológicamente. */
    balances: number[];
    /** Umbral financiero a vigilar (colchón, objetivo de capital, zona de riesgo). */
    threshold: number;
}

/**
 * Detecta los puntos en los que una serie de balances cruza un umbral.
 *
 * Devuelve todos los cruces (ascendentes y descendentes) para que el
 * consumidor decida qué hacer con cada uno (pintar dots, mostrar badges...).
 *
 * Función pura — no depende de React ni de ningún detalle de presentación.
 *
 * @returns [] si threshold < 0 (los balances negativos los gestiona la UI
 *          con threshold=0, que sí es válido como zona de riesgo).
 */
export const detectBalanceCrosses = ({
    balances,
    threshold,
}: DetectBalanceCrossesInput): CrossEvent[] => {
    if (threshold < 0) return [];

    const events: CrossEvent[] = [];

    for (let i = 1; i < balances.length; i++) {
        const prev = balances[i - 1];
        const curr = balances[i];

        if (prev < threshold && curr >= threshold) {
            events.push({ index: i, type: "gained" });
        } else if (prev >= threshold && curr < threshold) {
            events.push({ index: i, type: "lost" });
        }
    }

    return events;
};