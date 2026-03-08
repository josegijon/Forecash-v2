import { useState } from "react";
import { Calculator } from "lucide-react";

import { useActiveScenario, useCurrencySymbol, useScenarioStore } from "@/store";
import { CurrencyInputField } from "./CurrencyInputField";
import { CushionCalculatorModal } from "../modals/CushionCalculatorModal";

interface BalanceGoalsCardProps {
    title: string;
}

export const BalanceGoalsCard = ({ title }: BalanceGoalsCardProps) => {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const activeScenario = useActiveScenario();
    const currencySymbol = useCurrencySymbol();

    const initialBalance = activeScenario?.initialBalance ?? 0;
    const savingsGoal = activeScenario?.savingsGoal ?? 0;
    const cushionBalance = activeScenario?.cushionBalance ?? 0;
    const capitalGoal = activeScenario?.capitalGoal ?? 0;

    const setInitialBalance = useScenarioStore((s) => s.setInitialBalance);
    const setSavingsGoal = useScenarioStore((s) => s.setSavingsGoal);
    const setCushionBalance = useScenarioStore((s) => s.setCushionBalance);
    const setCapitalGoal = useScenarioStore((s) => s.setCapitalGoal);

    const [showCalculator, setShowCalculator] = useState(false);

    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                        <span className="text-amber-500 text-sm">🎯</span>
                    </div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                </div>

                <div className="space-y-4">
                    <CurrencyInputField
                        label="Saldo inicial actual"
                        value={initialBalance}
                        currencySymbol={currencySymbol}
                        onChange={(newValue) => setInitialBalance(activeScenarioId, newValue)}
                        allowNegative
                    />

                    <CurrencyInputField
                        label="Objetivo de ahorro mensual"
                        value={savingsGoal}
                        currencySymbol={currencySymbol}
                        onChange={(newValue) => setSavingsGoal(activeScenarioId, newValue)}
                    />

                    <div className="space-y-1.5">
                        <CurrencyInputField
                            label="Colchón mínimo (opcional)"
                            value={cushionBalance}
                            currencySymbol={currencySymbol}
                            onChange={(newValue) => setCushionBalance(activeScenarioId, newValue)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCalculator(true)}
                            className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium px-1 py-0.5 rounded transition-colors hover:underline cursor-pointer"
                        >
                            <Calculator className="w-3 h-3" />
                            Calcular automáticamente
                        </button>
                    </div>

                    <CurrencyInputField
                        label="Objetivo de capital (opcional)"
                        value={capitalGoal}
                        currencySymbol={currencySymbol}
                        onChange={(newValue) => setCapitalGoal(activeScenarioId, newValue)}
                    />
                </div>
            </div>

            {showCalculator && (
                <CushionCalculatorModal
                    onClose={() => setShowCalculator(false)}
                    onApply={(value) => setCushionBalance(activeScenarioId, value)}
                />
            )}
        </>
    );
};