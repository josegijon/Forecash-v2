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
    initialBalance: number;  // Saldo inicial del usuario
    savingsGoal: number;     // Objetivo de ahorro acumulado
    referenceYear: number;   // Año desde el que se empieza a acumular
    referenceMonth: number;  // Mes desde el que se empieza a acumular (0-indexed)
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
// Nota: complejidad O(meses * ítems). Aceptable para horizontes ≤ 60 meses.

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
        if (m > 11) { m = 0; y++; }
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

    // Ratios ∈ [0, 1] — el modelo los documenta como fracción, no porcentaje.
    // La capa de presentación es responsable de multiplicar por 100 si lo necesita.
    const savingsRate = totalIncome > 0
        ? Math.max(0, netBalance / totalIncome)
        : 0;

    const expenseRate = totalIncome > 0
        ? totalExpense / totalIncome
        : 0;

    // progressGoal: avance del ahorro acumulado hacia el objetivo.
    // Se acota a [0, 1] — no puede superar el 100 %.
    const progressGoal = savingsGoal > 0
        ? Math.min(Math.max(accumulatedSavings / savingsGoal, 0), 1)
        : 0;

    return {
        year,
        month,
        totalIncome,
        totalExpense,
        netBalance,
        accumulatedSavings,
        savingsRate,
        expenseRate,
        progressGoal,
    };
};