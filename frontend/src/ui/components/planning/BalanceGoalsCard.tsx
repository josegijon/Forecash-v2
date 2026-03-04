import { useMemo } from "react";

import { calculateMonthlySummary, isActiveMonth } from "@core";

import { useActiveScenario, useCurrencySymbol, usePlanningStore, useScenarioItems, useScenarioStore } from "@/store"
import { CurrencyInputField } from "./CurrencyInputField";
import { GoalProgressRing } from "./GoalProgressRing";

interface BalanceGoalsCardProps {
    title: string;
}

export const BalanceGoalsCard = ({ title }: BalanceGoalsCardProps) => {
    const currencySymbol = useCurrencySymbol();
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeMonth = usePlanningStore((s) => s.activeMonth);
    const activeYear = usePlanningStore((s) => s.activeYear);
    const allItems = useScenarioItems(activeScenarioId);
    const activeScenario = useActiveScenario();

    const setInitialBalance = useScenarioStore((s) => s.setInitialBalance);
    const setSavingsGoal = useScenarioStore((s) => s.setSavingsGoal);
    const setCushionBalance = useScenarioStore((s) => s.setCushionBalance);
    const setCapitalGoal = useScenarioStore((s) => s.setCapitalGoal);
    const initialBalance = activeScenario?.initialBalance ?? 0;
    const savingsGoal = activeScenario?.savingsGoal ?? 0;
    const cushionBalance = activeScenario?.cushionBalance ?? 0;
    const capitalGoal = activeScenario?.capitalGoal ?? 0;

    const now = new Date();
    const referenceMonth = now.getMonth();
    const referenceYear = now.getFullYear();

    const items = allItems.filter((item) =>
        isActiveMonth({ item, year: activeYear, month: activeMonth })
    );

    const summary = useMemo(() => calculateMonthlySummary({
        items, year: activeYear, month: activeMonth,
        initialBalance, savingsGoal, referenceYear, referenceMonth,
    }), [items, activeYear, activeMonth, initialBalance, savingsGoal, referenceYear, referenceMonth]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <span className="text-amber-500 text-sm">🎯</span>
                </div>
                <h3 className="font-bold text-slate-900">{title}</h3>
            </div>

            <div className="space-y-4">
                <CurrencyInputField
                    label="Saldo Inicial Actual"
                    value={initialBalance}
                    currencySymbol={currencySymbol}
                    onChange={(newValue) => setInitialBalance(activeScenarioId, newValue)}
                    allowNegative={true}
                />

                <CurrencyInputField
                    label="Objetivo de Ahorro Mensual"
                    value={savingsGoal}
                    currencySymbol={currencySymbol}
                    onChange={(newValue) => setSavingsGoal(activeScenarioId, newValue)}
                    allowNegative={false}
                />

                <CurrencyInputField
                    label="Colchón mínimo (opcional)"
                    value={cushionBalance}
                    currencySymbol={currencySymbol}
                    onChange={(newValue) => setCushionBalance(activeScenarioId, newValue)}
                    allowNegative={false}
                />

                <CurrencyInputField
                    label="Objetivo de capital (opcional)"
                    value={capitalGoal}
                    currencySymbol={currencySymbol}
                    onChange={(newValue) => setCapitalGoal(activeScenarioId, newValue)}
                    allowNegative={false}
                />

                {/* Progreso Meta */}
                <GoalProgressRing
                    progress={Math.round(summary.progressGoal)}
                    savedAmount={summary.netBalance}
                    goalAmount={savingsGoal}
                />
            </div>
        </div>
    )
}