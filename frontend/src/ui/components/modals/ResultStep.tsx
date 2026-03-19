import { Check, ChevronLeft, AlertTriangle } from "lucide-react";
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
            <div className="px-6 py-4 space-y-4">

                {/* Resultado o aviso si no hay gastos */}
                {fixedExpenses === 0 ? (
                    <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex gap-2">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <p>No hay gastos en tu escenario activo. Añade tus gastos fijos para obtener un importe real.</p>
                    </div>
                ) : (
                    <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5 text-center">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                            Colchón recomendado
                        </p>
                        <p className="text-3xl font-bold text-foreground">{formatAmount(result.totalAmount)}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {result.totalMonths} meses de gastos fijos · {formatAmount(fixedExpenses)}/mes
                        </p>
                    </div>
                )}

                {/* Desglose */}
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                        Cómo se ha calculado
                    </p>
                    <div className="space-y-2">
                        {result.breakdown.map((step, i) => {
                            const isTotal = step.sign === "=";
                            const monthsLabel = isTotal
                                ? `${step.months} m`
                                : `${step.months > 0 ? "+" : ""}${step.months} m`;

                            return (
                                <div key={i} className={`flex items-start justify-between gap-4 ${isTotal ? "pt-2 border-t border-border mt-2" : ""}`}>
                                    <div className="min-w-0">
                                        <p className={`text-sm leading-tight ${isTotal ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                                    </div>
                                    <span className={`text-sm shrink-0 tabular-nums ${isTotal ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                                        {monthsLabel}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border/60 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={16} />
                        Ajustar
                    </button>
                    <button
                        type="button"
                        onClick={onApply}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition-colors cursor-pointer"
                    >
                        <Check size={16} />
                        Aplicar
                    </button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                    Se guardará como colchón de seguridad en tu escenario actual.
                </p>
            </div>
        </>
    );
};