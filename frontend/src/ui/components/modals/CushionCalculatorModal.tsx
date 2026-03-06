import { useState, useMemo } from "react";
import { X, Calculator } from "lucide-react";

import { useCurrencySymbol, useScenarioItems, useScenarioStore } from "@/store";
import { isActiveMonth, addMonths } from "@core";

import {
    calculateCushion,
    type LaborProfile,
    type RiskProfile,
    type CushionInputs,
} from "./useCushionCalculator";
import { QuestionsStep } from "./QuestionsStep";
import { ResultStep } from "./ResultStep";

interface CushionCalculatorModalProps {
    onClose: () => void;
    onApply: (value: number) => void;
}

type Step = "questions" | "result";

export const CushionCalculatorModal = ({ onClose, onApply }: CushionCalculatorModalProps) => {
    const currencySymbol = useCurrencySymbol();
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const allItems = useScenarioItems(activeScenarioId);

    const fixedExpenses = useMemo(() => {
        const now = new Date();
        const refYear = now.getFullYear();
        const refMonth = now.getMonth();
        const MONTHS = 12;
        let total = 0;
        for (let i = 0; i < MONTHS; i++) {
            const { year, month } = addMonths({ year: refYear, month: refMonth }, i);
            total += allItems
                .filter((item) => item.type === "expense" && item.frequency !== "once" && isActiveMonth({ item, year, month }))
                .reduce((sum, item) => sum + item.amount, 0);
        }
        return Math.round(total / MONTHS);
    }, [allItems]);

    const [step, setStep] = useState<Step>("questions");
    const [laborProfile, setLaborProfile] = useState<LaborProfile>("empleado");
    const [hasDependants, setHasDependants] = useState(false);
    const [hasFixedDebt, setHasFixedDebt] = useState(false);
    const [riskProfile, setRiskProfile] = useState<RiskProfile>("equilibrado");

    const result = useMemo(() => {
        const inputs: CushionInputs = { laborProfile, hasDependants, hasFixedDebt, riskProfile };
        return calculateCushion(inputs, fixedExpenses);
    }, [laborProfile, hasDependants, hasFixedDebt, riskProfile, fixedExpenses]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                        <Calculator className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-slate-900 text-sm leading-tight">Calculadora de colchón</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {step === "questions"
                                ? "Responde unas preguntas para obtener una recomendación personalizada"
                                : "Así hemos calculado tu colchón recomendado"}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {step === "questions" ? (
                    <QuestionsStep
                        laborProfile={laborProfile}
                        hasDependants={hasDependants}
                        hasFixedDebt={hasFixedDebt}
                        riskProfile={riskProfile}
                        onLaborChange={setLaborProfile}
                        onDependantsChange={setHasDependants}
                        onDebtChange={setHasFixedDebt}
                        onRiskChange={setRiskProfile}
                        onNext={() => setStep("result")}
                        onClose={onClose}
                    />
                ) : (
                    <ResultStep
                        result={result}
                        fixedExpenses={fixedExpenses}
                        currencySymbol={currencySymbol}
                        onBack={() => setStep("questions")}
                        onApply={() => { onApply(result.totalAmount); onClose(); }}
                    />
                )}
            </div>
        </div>
    );
};