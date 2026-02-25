import { CashflowItem, MonthlySummary } from "@core/index";
import { isActiveMonth } from "@core/domain/rules/occurrence";

// ── Props para cálculos de un solo mes ──

interface MonthlyCalcProps {
    items: CashflowItem[];
    year: number;
    month: number; // 0-indexed (0 = Enero, 11 = Diciembre)
}

// ── Props para el resumen completo ──

interface MonthlySummaryProps extends MonthlyCalcProps {
    initialBalance: number;   // Saldo inicial del usuario (settingsStore)
    savingsGoal: number;      // Objetivo de ahorro (settingsStore)
    referenceYear: number;    // Año de referencia (mes desde el que se empieza a acumular)
    referenceMonth: number;   // Mes de referencia (normalmente el mes actual)
}

// ── Cálculos de un solo mes ──

export const calculateMonthlyIncome = ({ items, year, month }: MonthlyCalcProps): number => {
    return items
        .filter(item => item.type === "income" && isActiveMonth({ item, year, month }))
        .reduce((sum, item) => sum + item.amount, 0);
};

export const calculateMonthlyExpenses = ({ items, year, month }: MonthlyCalcProps): number => {
    return items
        .filter(item => item.type === "expense" && isActiveMonth({ item, year, month }))
        .reduce((sum, item) => sum + item.amount, 0);
};

export const calculateNetBalance = ({ items, year, month }: MonthlyCalcProps): number => {
    return calculateMonthlyIncome({ items, year, month })
        - calculateMonthlyExpenses({ items, year, month });
};

// ── Ahorro acumulado ──
// Suma el netBalance de cada mes desde (referenceYear, referenceMonth)
// hasta (targetYear, targetMonth), partiendo de initialBalance.

export const calculateAccumulatedSavings = (
    items: CashflowItem[],
    initialBalance: number,
    referenceYear: number,
    referenceMonth: number,
    targetYear: number,
    targetMonth: number,
): number => {
    let accumulated = initialBalance;
    let y = referenceYear;
    let m = referenceMonth;

    while (y < targetYear || (y === targetYear && m <= targetMonth)) {
        accumulated += calculateNetBalance({ items, year: y, month: m });

        m++;
        if (m > 11) {
            m = 0;
            y++;
        }
    }

    return accumulated;
};

// ── Resumen mensual completo ──

export const calculateMonthlySummary = ({
    items,
    year,
    month,
    initialBalance,
    savingsGoal,
    referenceYear,
    referenceMonth,
}: MonthlySummaryProps): MonthlySummary => {
    const totalIncome = calculateMonthlyIncome({ items, year, month });
    const totalExpense = calculateMonthlyExpenses({ items, year, month });
    const netBalance = totalIncome - totalExpense;

    const accumulatedSavings = calculateAccumulatedSavings(
        items, initialBalance,
        referenceYear, referenceMonth,
        year, month,
    );

    const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;
    const expenseRate = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
    const progressGoal = savingsGoal > 0 ? accumulatedSavings / savingsGoal : 0;

    return {
        totalIncome,
        totalExpense,
        netBalance,
        accumulatedSavings,
        savingsRate,
        expenseRate,
        progressGoal,
    };
};