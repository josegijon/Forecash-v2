import { useState, useMemo } from "react";
import { X } from "lucide-react";

import { useCurrencySymbol, useScenarioItems, useScenarioStore } from "@/store";
import {
    calculateCushion,
    isActiveMonth,
    addMonths,
    type LaborProfile,
    type RiskProfile,
    type CushionInputs,
} from "@core";

import { QuestionsStep } from "./QuestionsStep";
import { ResultStep } from "./ResultStep";
import { Button } from "@/ui/primitives/Button";

interface CushionCalculatorModalProps {
    onClose: () => void;
    onApply: (value: number) => void;
}

type Step = "questions" | "result";

export const CushionCalculatorModal = ({ onClose, onApply }: CushionCalculatorModalProps) => {
    const currencySymbol = useCurrencySymbol();
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const allItems = useScenarioItems(activeScenarioId);

    const [step, setStep] = useState<Step>("questions");
    const [laborProfile, setLaborProfile] = useState<LaborProfile>("empleado");
    const [hasDependants, setHasDependants] = useState(false);
    const [hasFixedDebt, setHasFixedDebt] = useState(false);
    const [riskProfile, setRiskProfile] = useState<RiskProfile>("equilibrado");

    const fixedExpenses = useMemo(() => {
        const now = new Date();
        const ref = { year: now.getFullYear(), month: now.getMonth() };
        let total = 0;
        for (let i = 0; i < 12; i++) {
            const { year, month } = addMonths(ref, i);
            total += allItems
                .filter((item) => item.type === "expense" && item.frequency !== "once" && isActiveMonth({ item, year, month }))
                .reduce((sum, item) => sum + item.amount, 0);
        }
        return Math.round(total / 12);
    }, [allItems]);

    const result = useMemo(() => {
        const inputs: CushionInputs = { laborProfile, hasDependants, hasFixedDebt, riskProfile };
        return calculateCushion(inputs, fixedExpenses);
    }, [laborProfile, hasDependants, hasFixedDebt, riskProfile, fixedExpenses]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-xl border border-border overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                    <div className="min-w-0">
                        <h2 className="text-lg font-medium leading-none tracking-tight">Calculadora de colchón</h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            {step === "questions"
                                ? "Responde unas preguntas para obtener una recomendación personalizada"
                                : "Así hemos calculado tu colchón recomendado"}
                        </p>
                        <div className="flex gap-1 mt-2">
                            <span className={`h-1 w-4 rounded-full transition-colors ${step === "questions" ? "bg-primary" : "bg-muted-foreground/30"}`} />
                            <span className={`h-1 w-4 rounded-full transition-colors ${step === "result" ? "bg-primary" : "bg-muted-foreground/30"}`} />
                        </div>
                    </div>

                    <Button
                        intent="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <X size={16} />
                    </Button>
                </div>

                {step === "questions" ? (
                    <QuestionsStep
                        laborProfile={laborProfile}
                        hasDependants={hasDependants}
                        hasFixedDebt={hasFixedDebt}
                        riskProfile={riskProfile}
                        onLaborChange={setLaborProfile}
                        onDependantsChange={setHasDependants}
                        onFixedDebtChange={setHasFixedDebt}
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