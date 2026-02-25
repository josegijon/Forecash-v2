import { usePlanningStore, useScenarioItems, useScenarioStore, useSettingsStore, useCurrencySymbol } from "@/store"
import { calculateMonthlySummary } from "@core"
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react"
import { useMemo } from "react"

interface SummaryCardProps {
    label: string
    value: string
    icon: React.ReactNode
    trend?: { value: string; positive: boolean }
    accentClass: string
    bgClass: string
}

const SummaryCard = ({ label, value, icon, trend, accentClass, bgClass }: SummaryCardProps) => (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${accentClass}`}>
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-xl font-extrabold text-slate-800">{value}</span>
            {trend && (
                <span className={`text-[11px] font-semibold ${trend.positive ? "text-emerald-500" : "text-rose-500"}`}>
                    {trend.positive ? "↑" : "↓"} {trend.value} vs mes anterior
                </span>
            )}
        </div>
    </div>
)

/** Calcula el % de variación entre dos valores. Devuelve null si no hay referencia. */
const calcTrend = (current: number, previous: number): { value: string; positive: boolean } | undefined => {
    if (previous === 0 && current === 0) return undefined;
    if (previous === 0) return { value: "nuevo", positive: current > 0 };

    const pct = ((current - previous) / Math.abs(previous)) * 100;

    return {
        value: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
        positive: current <= previous, // para gastos "menos = bueno", se invierte por card
    };
};

/** Formatea un número como moneda: €1.050,00 */
const formatCurrency = (amount: number, symbol: string): string => {
    const formatted = Math.abs(amount).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `${amount < 0 ? "-" : ""}${symbol}${formatted}`;
};

/** Devuelve el mes anterior dado (year, month 0-indexed) */
const getPreviousMonth = (year: number, month: number) => {
    if (month === 0) return { year: year - 1, month: 11 };
    return { year, month: month - 1 };
};

export const PlanningSummaryStrip = () => {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeMonth = usePlanningStore((s) => s.activeMonth);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const items = useScenarioItems(activeScenarioId);
    const initialBalance = useSettingsStore((s) => s.initialBalance);
    const savingsGoal = useSettingsStore((s) => s.savingsGoal);
    const currencySymbol = useCurrencySymbol();

    const now = new Date();
    const referenceMonth = now.getMonth();
    const referenceYear = now.getFullYear();

    const summary = useMemo(() => calculateMonthlySummary({
        items, year: activeYear, month: activeMonth,
        initialBalance, savingsGoal, referenceYear, referenceMonth,
    }), [items, activeYear, activeMonth, initialBalance, savingsGoal, referenceYear, referenceMonth]);

    const prev = getPreviousMonth(activeYear, activeMonth);
    const prevSummary = useMemo(() => calculateMonthlySummary({
        items, year: prev.year, month: prev.month,
        initialBalance, savingsGoal, referenceYear, referenceMonth,
    }), [items, prev.year, prev.month, initialBalance, savingsGoal, referenceYear, referenceMonth]);

    const incomeTrend = calcTrend(summary.totalIncome, prevSummary.totalIncome);
    const expenseTrend = calcTrend(summary.totalExpense, prevSummary.totalExpense);
    const balanceTrend = calcTrend(summary.netBalance, prevSummary.netBalance);

    const cards: SummaryCardProps[] = [
        {
            label: "Ingresos totales",
            value: formatCurrency(summary.totalIncome, currencySymbol),
            icon: <TrendingUp size={22} />,
            trend: incomeTrend ? { ...incomeTrend, positive: summary.totalIncome >= prevSummary.totalIncome } : undefined,
            accentClass: "text-emerald-600",
            bgClass: "bg-emerald-50",
        },
        {
            label: "Gastos totales",
            value: formatCurrency(summary.totalExpense, currencySymbol),
            icon: <TrendingDown size={22} />,
            trend: expenseTrend ? { ...expenseTrend, positive: summary.totalExpense <= prevSummary.totalExpense } : undefined,
            accentClass: "text-rose-600",
            bgClass: "bg-rose-50",
        },
        {
            label: "Balance neto",
            value: formatCurrency(summary.netBalance, currencySymbol),
            icon: <Wallet size={22} />,
            trend: balanceTrend ? { ...balanceTrend, positive: summary.netBalance >= prevSummary.netBalance } : undefined,
            accentClass: "text-blue-600",
            bgClass: "bg-blue-50",
        },
        {
            label: "Ahorro acumulado",
            value: formatCurrency(summary.accumulatedSavings, currencySymbol),
            icon: <PiggyBank size={22} />,
            accentClass: "text-violet-600",
            bgClass: "bg-violet-50",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
                <SummaryCard key={card.label} {...card} />
            ))}
        </div>
    )
}
