import { ChevronRight } from "lucide-react";
import type { LaborProfile, RiskProfile } from "@core";
import { ToggleRow } from "./ToggleRow";
import { LABOR_OPTIONS, RISK_OPTIONS } from "./cushionConstants";

interface QuestionsStepProps {
    laborProfile: LaborProfile;
    hasDependants: boolean;
    hasFixedDebt: boolean;
    riskProfile: RiskProfile;
    onLaborChange: (v: LaborProfile) => void;
    onDependantsChange: (v: boolean) => void;
    onFixedDebtChange: (v: boolean) => void;
    onRiskChange: (v: RiskProfile) => void;
    onNext: () => void;
    onClose: () => void;
}

export const QuestionsStep = ({
    laborProfile, hasDependants, hasFixedDebt, riskProfile,
    onLaborChange, onDependantsChange, onFixedDebtChange, onRiskChange,
    onNext, onClose,
}: QuestionsStepProps) => (
    <>
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
            <fieldset>
                <legend className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    ¿Cuál es tu situación laboral?
                </legend>
                <div className="space-y-2">
                    {LABOR_OPTIONS.map((opt) => (
                        <ToggleRow
                            key={opt.value}
                            emoji={opt.emoji}
                            label={opt.label}
                            checked={laborProfile === opt.value}
                            onChange={() => onLaborChange(opt.value)}
                        />
                    ))}
                </div>
            </fieldset>

            <div className="space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tu situación personal</p>
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
                    onChange={onFixedDebtChange}
                />
            </div>

            <fieldset>
                <legend className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    ¿Cómo de tranquilo/a quieres dormir?
                </legend>
                <div className="grid grid-cols-3 gap-2">
                    {RISK_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onRiskChange(opt.value)}
                            className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-center transition-all cursor-pointer ${riskProfile === opt.value
                                ? "border-primary/50 bg-primary/10"
                                : "border-border bg-card hover:border-border/80 hover:bg-muted/50"
                                }`}
                        >
                            <span className="text-xl">{opt.emoji}</span>
                            <span className={`text-xs font-semibold leading-tight ${riskProfile === opt.value ? "text-primary" : "text-foreground"}`}>
                                {opt.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground leading-tight">{opt.sublabel}</span>
                        </button>
                    ))}
                </div>
            </fieldset>
        </div>

        <div className="px-6 pb-6 pt-3 border-t border-border flex gap-2">
            <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
                Cancelar
            </button>
            <button
                type="button"
                onClick={onNext}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
                Calcular
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    </>
);