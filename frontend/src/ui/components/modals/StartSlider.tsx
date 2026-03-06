import { Clock } from "lucide-react";

interface StartSliderProps {
    value: number;
    onChange: (v: number) => void;
}

export const StartSlider = ({ value, onChange }: StartSliderProps) => (
    <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            <Clock size={12} className="inline mr-1 -mt-0.5" />
            Inicia dentro de
        </label>

        <div className="flex items-center gap-3">
            <input
                type="range"
                min={0}
                max={24}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
            />

            <span className="min-w-18 text-center text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                {value === 0 ? "Ahora" : `${value} m`}
            </span>
        </div>
    </div>
);