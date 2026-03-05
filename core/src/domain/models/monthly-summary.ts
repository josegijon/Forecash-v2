/**
 * Resumen financiero calculado para un mes concreto.
 *
 * Ratios:
 *  - savingsRate ∈ [0, 1]  (0 si totalIncome === 0)
 *  - expenseRate ∈ [0, ∞)  (0 si totalIncome === 0)
 *  - progressGoal ∈ [0, 1] (0 si savingsGoal === 0)
 *
 * accumulatedSavings = suma de netBalance desde referenceMonth hasta este mes (inclusive).
 */
export interface MonthlySummary {
    /** Año del mes resumido (ej: 2025) */
    readonly year: number;
    /** Mes del mes resumido, 0-indexed (0 = Enero) */
    readonly month: number;

    readonly totalIncome: number;
    readonly totalExpense: number;
    /** totalIncome - totalExpense */
    readonly netBalance: number;
    /** Suma acumulada de netBalance desde referenceMonth hasta este mes */
    readonly accumulatedSavings: number;
    /** netBalance / totalIncome — 0 si totalIncome === 0 */
    readonly savingsRate: number;
    /** totalExpense / totalIncome — 0 si totalIncome === 0 */
    readonly expenseRate: number;
    /** accumulatedSavings / savingsGoal — 0 si savingsGoal === 0 */
    readonly progressGoal: number;
}