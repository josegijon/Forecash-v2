/**
 * Escenario de planificación financiera.
 *
 * Invariantes:
 *  - initialBalance puede ser negativo (deuda inicial)
 *  - savingsGoal >= 0
 *  - cushionBalance >= 0
 *  - capitalGoal >= 0 si existe
 */
export interface Scenario {
    readonly id: string;
    readonly name: string;
    /** Saldo inicial desde el que arranca la proyección. Puede ser negativo. */
    readonly initialBalance: number;
    /** Objetivo de ahorro acumulado. */
    readonly savingsGoal: number;
    /** Colchón de seguridad (cantidad mínima a mantener en cuenta). */
    readonly cushionBalance: number;
    /** Objetivo de capital total. Opcional. */
    readonly capitalGoal?: number;
}