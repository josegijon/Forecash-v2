import { ChevronRight, Zap, Scale, Shield, type LucideIcon } from "lucide-react";
import type { LaborProfile, RiskProfile } from "@core";
import { LABOR_OPTIONS, RISK_OPTIONS } from "./cushionConstants";
import { Button } from "@/ui/primitives/Button";

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

interface ToggleRowProps {
    label: string;
    sublabel?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}

const RISK_ICONS: Record<RiskProfile, LucideIcon> = {
    justo: Zap,
    equilibrado: Scale,
    conservador: Shield,
};

const ToggleRow = ({ label, sublabel, checked, onChange }: ToggleRowProps) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${checked
            ? "border-primary/50 bg-primary/10"
            : "border-border/60 bg-muted/40 hover:bg-muted"
            }`}
    >
        <div className="min-w-0">
            <p className="text-sm font-medium text-foreground leading-tight">{label}</p>
            {sublabel && (
                <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
            )}
        </div>
        <div className={`relative shrink-0 w-9 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
        </div>
    </button>
);

export const QuestionsStep = ({
    laborProfile, hasDependants, hasFixedDebt, riskProfile,
    onLaborChange, onDependantsChange, onFixedDebtChange, onRiskChange,
    onNext, onClose,
}: QuestionsStepProps) => (
    <>
        <div className="px-6 py-4 space-y-4">

            {/* Situación laboral */}
            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Situación laboral
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {LABOR_OPTIONS.map((opt) => (
                        <Button
                            type="button"
                            intent="chip"
                            active={laborProfile === opt.value}
                            onClick={() => onLaborChange(opt.value)}
                        >
                            {opt.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Situación personal */}
            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Situación personal
                </p>
                <div className="space-y-2">
                    <ToggleRow
                        label="Personas a cargo"
                        sublabel="Hijos, familiares dependientes..."
                        checked={hasDependants}
                        onChange={onDependantsChange}
                    />
                    <ToggleRow
                        label="Deudas con cuota fija"
                        sublabel="Hipoteca, préstamo de coche..."
                        checked={hasFixedDebt}
                        onChange={onFixedDebtChange}
                    />
                </div>
            </div>

            {/* Nivel de cobertura */}
            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Nivel de cobertura
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {RISK_OPTIONS.map((opt) => {
                        const Icon = RISK_ICONS[opt.value];
                        const isSelected = riskProfile === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onRiskChange(opt.value)}
                                className={`flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border text-center transition-all cursor-pointer ${isSelected
                                    ? "border-primary/50 bg-primary/10"
                                    : "border-border/60 bg-muted/40 hover:bg-muted"
                                    }`}
                            >
                                <Icon
                                    size={16}
                                    className={isSelected ? "text-primary" : "text-muted-foreground"}
                                />
                                <span className={`text-xs font-semibold leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                                    {opt.label}
                                </span>
                                <span className="text-[10px] text-muted-foreground leading-tight">
                                    {opt.sublabel}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-2">
            <Button
                intent="secondary"
                onClick={onClose}
                className="flex-1"
            >
                Cancelar
            </Button>
            <button
                type="button"
                onClick={onNext}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
                Calcular
                <ChevronRight size={16} />
            </button>
        </div>
    </>
);