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
    const fmt = (n: number) =>
        `${currencySymbol}${n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    return (
        <>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100 p-5 text-center">
                    <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">
                        Colchón recomendado
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{fmt(result.totalAmount)}</p>
                    <p className="text-sm text-slate-500 mt-1">
                        {result.totalMonths} meses de gastos fijos · {fmt(fixedExpenses)}/mes
                    </p>
                </div>

                <div>
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Cómo se ha calculado</p>
                    <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
                        {result.breakdown.map((step, i) => (
                            <div key={i} className="flex items-start gap-3 px-4 py-3">
                                <span className="text-xs font-bold text-slate-400 w-4 shrink-0 mt-0.5">{step.sign}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800">{step.label}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                                </div>
                                <span className="text-sm font-bold text-slate-700 shrink-0">
                                    {step.months > 0 ? `+${step.months}` : step.months} m
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {fixedExpenses === 0 && (
                    <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-xs text-rose-600">
                        ⚠️ No hemos detectado gastos en tu escenario activo. Añade tus gastos fijos para obtener un importe real.
                    </div>
                )}
            </div>

            <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex gap-2">
                <button type="button" onClick={onBack} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                    ← Ajustar
                </button>
                <button type="button" onClick={onApply} className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <Check className="w-4 h-4" />
                    Aplicar
                </button>
            </div>
        </>
    );
};