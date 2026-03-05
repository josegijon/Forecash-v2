import { useState, useMemo } from "react";
import { X, ChevronRight, Calculator, Check } from "lucide-react";

import { useCurrencySymbol, useScenarioItems, useScenarioStore } from "@/store";
import { isActiveMonth, addMonths } from "@core";

import {
    calculateCushion,
    LABOR_OPTIONS,
    RISK_OPTIONS,
    type LaborProfile,
    type RiskProfile,
    type CushionInputs,
} from "./useCushionCalculator";

interface CushionCalculatorModalProps {
    onClose: () => void;
    onApply: (value: number) => void;
}

type Step = "questions" | "result";

export const CushionCalculatorModal = ({ onClose, onApply }: CushionCalculatorModalProps) => {
    const currencySymbol = useCurrencySymbol();
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const allItems = useScenarioItems(activeScenarioId);

    // Calcular media mensual de gastos recurrentes (excluye gastos puntuales "once")
    const fixedExpenses = useMemo(() => {
        const now = new Date();
        const refYear = now.getFullYear();
        const refMonth = now.getMonth();
        const MONTHS = 12;
        let total = 0;

        for (let i = 0; i < MONTHS; i++) {
            const { year, month } = addMonths({ year: refYear, month: refMonth }, i);

            const monthExpenses = allItems
                .filter((item) =>
                    item.type === "expense" &&
                    item.frequency !== "once" &&
                    isActiveMonth({ item, year, month })
                )
                .reduce((sum, item) => sum + item.amount, 0);

            total += monthExpenses;
        }

        return Math.round(total / MONTHS);
    }, [allItems]);

    const [step, setStep] = useState<Step>("questions");
    const [laborProfile, setLaborProfile] = useState<LaborProfile>("empleado");
    const [hasDependants, setHasDependants] = useState(false);
    const [hasFixedDebt, setHasFixedDebt] = useState(false);
    const [riskProfile, setRiskProfile] = useState<RiskProfile>("equilibrado");

    const result = useMemo(
        () => {
            const inputs: CushionInputs = { laborProfile, hasDependants, hasFixedDebt, riskProfile };
            return calculateCushion(inputs, fixedExpenses);
        },
        [laborProfile, hasDependants, hasFixedDebt, riskProfile, fixedExpenses]
    );

    const formatCurrency = (n: number) =>
        `${currencySymbol}${n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    return (
        // Backdrop
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
                        <h2 className="font-bold text-slate-900 text-sm leading-tight">
                            Calculadora de colchón
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {step === "questions"
                                ? "Responde unas preguntas para obtener una recomendación personalizada"
                                : "Así hemos calculado tu colchón recomendado"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                    {step === "questions" ? (
                        <>
                            {/* Pregunta 1: Perfil laboral */}
                            <fieldset>
                                <legend className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                                    ¿Cuál es tu situación laboral?
                                </legend>
                                <div className="space-y-2">
                                    {LABOR_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setLaborProfile(opt.value)}
                                            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left text-sm transition-all cursor-pointer ${laborProfile === opt.value
                                                ? "border-amber-400 bg-amber-50 text-slate-900 font-medium"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                        >
                                            <span className="text-base">{opt.emoji}</span>
                                            <span>{opt.label}</span>
                                            {laborProfile === opt.value && (
                                                <Check className="w-4 h-4 text-amber-500 ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            {/* Pregunta 2 & 3: toggles */}
                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                    Tu situación personal
                                </p>

                                <ToggleRow
                                    emoji="👨‍👩‍👧"
                                    label="Tengo personas a cargo"
                                    sublabel="Hijos, familiares dependientes, etc."
                                    checked={hasDependants}
                                    onChange={setHasDependants}
                                />
                                <ToggleRow
                                    emoji="🏠"
                                    label="Tengo deudas con cuota fija"
                                    sublabel="Hipoteca, préstamo de coche, etc."
                                    checked={hasFixedDebt}
                                    onChange={setHasFixedDebt}
                                />
                            </div>

                            {/* Pregunta 4: Perfil de riesgo */}
                            <fieldset>
                                <legend className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                                    ¿Cómo de tranquilo/a quieres dormir?
                                </legend>
                                <div className="grid grid-cols-3 gap-2">
                                    {RISK_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setRiskProfile(opt.value)}
                                            className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-center transition-all cursor-pointer ${riskProfile === opt.value
                                                ? "border-amber-400 bg-amber-50"
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                        >
                                            <span className="text-xl">{opt.emoji}</span>
                                            <span className={`text-xs font-semibold leading-tight ${riskProfile === opt.value ? "text-amber-700" : "text-slate-700"}`}>
                                                {opt.label}
                                            </span>
                                            <span className="text-[10px] text-slate-400 leading-tight">
                                                {opt.sublabel}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </fieldset>
                        </>
                    ) : (
                        /* ── Step resultado ─────────────────────────────── */
                        <div className="space-y-4">
                            {/* Número grande */}
                            <div className="rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100 p-5 text-center">
                                <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">
                                    Colchón recomendado
                                </p>
                                <p className="text-3xl font-bold text-slate-900">
                                    {formatCurrency(result.totalAmount)}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                    {result.totalMonths} {result.totalMonths === 1 ? "mes" : "meses "} de gastos fijos
                                    &nbsp;·&nbsp;
                                    <span className="text-slate-400">{formatCurrency(fixedExpenses)}/mes</span>
                                </p>
                            </div>

                            {/* Desglose */}
                            <div>
                                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                                    Cómo se ha calculado
                                </p>
                                <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
                                    {result.breakdown.map((step, i) => (
                                        <div key={i} className="flex items-start gap-3 px-4 py-3 bg-white">
                                            <span className={`text-xs font-bold w-5 text-right shrink-0 mt-0.5 ${step.sign === "+" ? "text-emerald-500" : "text-slate-400"
                                                }`}>
                                                {i === 0 ? "" : step.sign}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800">{step.label}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                                            </div>
                                            <span className={`text-sm font-bold shrink-0 ${step.months > 0 ? "text-slate-700" : "text-rose-400"
                                                }`}>
                                                {step.months > 0 ? "+" : ""}{step.months}m
                                            </span>
                                        </div>
                                    ))}

                                    {/* Total */}
                                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50">
                                        <span className="text-xs font-bold w-5 text-right shrink-0 text-slate-400">=</span>
                                        <p className="flex-1 text-sm font-bold text-slate-900">Total</p>
                                        <span className="text-sm font-bold text-amber-600">
                                            {result.totalMonths}m
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Aviso si no hay gastos */}
                            {fixedExpenses === 0 && (
                                <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-xs text-rose-600">
                                    ⚠️ No hemos detectado gastos en tu escenario activo. Añade tus gastos fijos para obtener un importe real.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex gap-2">
                    {step === "questions" ? (
                        <>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep("result")}
                                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                Calcular
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setStep("questions")}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                ← Ajustar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onApply(result.totalAmount);
                                    onClose();
                                }}
                                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Check className="w-4 h-4" />
                                Aplicar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Subcomponente toggle ─────────────────────────────────────────────────────

interface ToggleRowProps {
    emoji: string;
    label: string;
    sublabel: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}

const ToggleRow = ({ emoji, label, sublabel, checked, onChange }: ToggleRowProps) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-all cursor-pointer ${checked
            ? "border-amber-400 bg-amber-50"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
    >
        <span className="text-base shrink-0">{emoji}</span>
        <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-tight ${checked ? "text-slate-900" : "text-slate-700"}`}>
                {label}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>
        </div>
        {/* Toggle pill */}
        <div className={`relative shrink-0 w-10 h-5.5 rounded-full transition-colors ${checked ? "bg-amber-500" : "bg-slate-200"}`}>
            <div className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.75"}`} />
        </div>
    </button>
);