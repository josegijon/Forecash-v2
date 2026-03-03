import { useMemo } from "react";

import { calculateMonthlySummary, isActiveMonth } from "@core";

import { useCurrencySymbol, usePlanningStore, useScenarioItems, useScenarioStore, useSettingsStore } from "@/store"
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
    const initialBalance = useSettingsStore((s) => s.initialBalance);
    const savingsGoal = useSettingsStore((s) => s.savingsGoal);
    const setInitialBalance = useSettingsStore((s) => s.setInitialBalance);
    const setSavingsGoal = useSettingsStore((s) => s.setSavingsGoal);
    const cushionBalance = useSettingsStore((s) => s.cushionBalance);
    const setCushionBalance = useSettingsStore((s) => s.setCushionBalance);

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
                    onChange={(newValue) => setInitialBalance(newValue)}
                    allowNegative={true}
                />


                <CurrencyInputField
                    label="Objetivo de Ahorro Mensual"
                    value={savingsGoal}
                    currencySymbol={currencySymbol}
                    onChange={(newValue) => setSavingsGoal(newValue)}
                    allowNegative={false}
                />

                <CurrencyInputField
                    label="Colchón mínimo (opcional)"
                    value={cushionBalance}
                    currencySymbol={currencySymbol}
                    onChange={(newValue) => setCushionBalance(newValue)}
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
