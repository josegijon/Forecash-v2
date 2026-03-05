import { Clock } from "lucide-react";

interface EndDateSectionProps {
    hasEndDate: boolean;
    endsInMonths: number;
    startsInMonths: number;
    onToggle: (v: boolean) => void;
    onChange: (v: number) => void;
}

export const EndDateSection = ({ hasEndDate, endsInMonths, startsInMonths, onToggle, onChange }: EndDateSectionProps) => (
    <div>
        <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Clock size={12} className="inline mr-1 -mt-0.5" />
                Finaliza dentro de
            </label>
            <button
                type="button"
                onClick={() => onToggle(!hasEndDate)}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${hasEndDate
                    ? "bg-slate-200 text-slate-600"
                    : "bg-primary/10 text-primary"
                    }`}
            >
                {hasEndDate ? "Quitar límite" : "Añadir límite"}
            </button>
        </div>

        {hasEndDate && (
            <div className="flex items-center gap-3 mt-3">
                <input
                    type="range"
                    min={startsInMonths + 1}
                    max={120}
                    value={endsInMonths}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span className="min-w-18 text-center text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    {endsInMonths} m
                </span>
            </div>
        )}
    </div>
);