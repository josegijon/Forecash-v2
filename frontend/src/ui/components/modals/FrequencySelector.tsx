import { CalendarClock } from "lucide-react";
import type { Frequency } from "@core";

const frequencyLabels: Record<Frequency, string> = {
    once: "Una vez",
    monthly: "Mensual",
    bimonthly: "Bimestral",
    quarterly: "Trimestral",
    semiannual: "Semestral",
    annual: "Anual",
};

interface FrequencySelectorProps {
    value: Frequency;
    onChange: (f: Frequency) => void;
}

export const FrequencySelector = ({ value, onChange }: FrequencySelectorProps) => (
    <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            <CalendarClock size={12} className="inline mr-1 -mt-0.5" />
            Frecuencia
        </label>

        <div className="grid grid-cols-3 gap-2">
            {(Object.entries(frequencyLabels) as [Frequency, string][]).map(([freq, label]) => (
                <button
                    key={freq}
                    type="button"
                    onClick={() => onChange(freq)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${value === freq
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    </div>
);