import { ChevronRight } from "lucide-react";
import type { LaborProfile, RiskProfile } from "@core";
import { LABOR_OPTIONS, RISK_OPTIONS } from "./useCushionCalculator";
import { ToggleRow } from "./ToggleRow";

interface QuestionsStepProps {
    laborProfile: LaborProfile;
    hasDependants: boolean;
    hasFixedDebt: boolean;
    riskProfile: RiskProfile;
    onLaborChange: (v: LaborProfile) => void;
    onDependantsChange: (v: boolean) => void;
    onDebtChange: (v: boolean) => void;
    onRiskChange: (v: RiskProfile) => void;
    onNext: () => void;
    onClose: () => void;
}

export const QuestionsStep = ({
    laborProfile, hasDependants, hasFixedDebt, riskProfile,
    onLaborChange, onDependantsChange, onDebtChange, onRiskChange,
    onNext, onClose,
}: QuestionsStepProps) => (
    <>
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
            <fieldset>
                <legend className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    ¿Cuál es tu situación laboral?
                </legend>
                <div className="space-y-2">
                    {LABOR_OPTIONS.map((opt) => (
                        <ToggleRow
                            key={opt.value}
                            emoji={opt.emoji}
                            label={opt.label}
                            sublabel=""
                            checked={laborProfile === opt.value}
                            onChange={() => onLaborChange(opt.value)}
                        />
                    ))}
                </div>
            </fieldset>

            <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Tu situación personal</p>
                <ToggleRow
                    emoji="👨‍👩‍👧"
                    label="Tengo personas a cargo"
                    sublabel="Hijos, familiares dependientes, etc."
                    checked={hasDependants}
                    onChange={onDependantsChange}
                />
                <ToggleRow
                    emoji="🏠"
                    label="Tengo deudas con cuota fija"
                    sublabel="Hipoteca, préstamo de coche, etc."
                    checked={hasFixedDebt}
                    onChange={onDebtChange}
                />
            </div>

            <fieldset>
                <legend className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    ¿Cómo de tranquilo/a quieres dormir?
                </legend>
                <div className="grid grid-cols-3 gap-2">
                    {RISK_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onRiskChange(opt.value)}
                            className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-center transition-all cursor-pointer ${riskProfile === opt.value
                                ? "border-amber-400 bg-amber-50"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                }`}
                        >
                            <span className="text-xl">{opt.emoji}</span>
                            <span className={`text-xs font-semibold leading-tight ${riskProfile === opt.value ? "text-amber-700" : "text-slate-700"}`}>
                                {opt.label}
                            </span>
                            <span className="text-[10px] text-slate-400 leading-tight">{opt.sublabel}</span>
                        </button>
                    ))}
                </div>
            </fieldset>
        </div>

        <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                Cancelar
            </button>
            <button type="button" onClick={onNext} className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                Calcular
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    </>
);