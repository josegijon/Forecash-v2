export interface MonthlySummary {
    totalIncome: number;
    totalExpense: number;
    netBalance: number; // totalIncome - totalExpense
    accumulatedSavings: number;
    savingsRate: number; // netBalance / totalIncome (0 si totalIncome es 0)
    expenseRate: number; // totalExpense / totalIncome
    progressGoal: number;
}