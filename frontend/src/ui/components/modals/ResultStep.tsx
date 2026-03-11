import { Check } from "lucide-react";
import type { CushionResult } from "@core";

interface ResultStepProps {
    result: CushionResult;
    fixedExpenses: number;
    currencySymbol: string;
    onBack: () => void;
    onApply: () => void;
}

export const ResultStep = ({ result, fixedExpenses, currencySymbol, onBack, onApply }: ResultStepProps) => {
    const formatAmount = (n: number) =>
        `${currencySymbol}${n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    return (
        <>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5 text-center">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                        Colchón recomendado
                    </p>
                    <p className="text-3xl font-bold text-foreground">{formatAmount(result.totalAmount)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {result.totalMonths} meses de gastos fijos · {formatAmount(fixedExpenses)}/mes
                    </p>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Cómo se ha calculado</p>
                    <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                        {result.breakdown.map((step, i) => (
                            <div key={i} className="flex items-start gap-3 px-4 py-3 bg-card">
                                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0 mt-0.5">{step.sign}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">{step.label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                                </div>
                                <span className="text-sm font-bold text-foreground shrink-0">
                                    {step.months > 0 ? `+${step.months}` : step.months} m
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {fixedExpenses === 0 && (
                    <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
                        ⚠️ No hemos detectado gastos en tu escenario activo. Añade tus gastos fijos para obtener un importe real.
                    </div>
                )}
            </div>

            <div className="px-6 pb-6 pt-3 border-t border-border flex gap-2">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                    ← Ajustar
                </button>
                <button
                    type="button"
                    onClick={onApply}
                    className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <Check className="w-4 h-4" />
                    Aplicar
                </button>
            </div>
        </>
    );
};