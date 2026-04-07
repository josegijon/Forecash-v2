import type { FocusEvent } from "react";
import { addMonths } from "@core";
import { MONTH_NAMES } from "../../utils/projectionConstants";
import { Input } from "@/ui/primitives/Input";

interface EndDateSectionProps {
    hasEndDate: boolean;
    endsInMonths: number;
    startsInMonths: number;
    onToggle: (v: boolean) => void;
    onChange: (v: number) => void;
}

const getMonthLabel = (offsetMonths: number): string => {
    const now = new Date();
    const { year, month } = addMonths({ year: now.getFullYear(), month: now.getMonth() }, offsetMonths);
    return `Finaliza en ${MONTH_NAMES[month]} de ${year}`;
};

export const EndDateSection = ({ hasEndDate, endsInMonths, startsInMonths, onToggle, onChange }: EndDateSectionProps) => {
    const min = startsInMonths + 1;

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const parsed = parseInt(e.target.value, 10);
        if (isNaN(parsed) || parsed < min) return onChange(min);
        if (parsed > 120) return onChange(120);
        onChange(parsed);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Finaliza dentro de
                </label>
                <button
                    type="button"
                    onClick={() => onToggle(!hasEndDate)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${hasEndDate
                        ? "bg-muted text-muted-foreground hover:text-foreground"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                >
                    {hasEndDate ? "Quitar límite" : "Añadir límite"}
                </button>
            </div>

            {hasEndDate && (
                <div>
                    <div className="relative">
                        <Input
                            type="number"
                            min={min}
                            max={120}
                            defaultValue={endsInMonths}
                            key={endsInMonths}
                            onBlur={handleBlur}
                            placeholder={String(min)}
                            className="pr-16"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                            meses
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{getMonthLabel(endsInMonths)}</p>
                </div>
            )}
        </div>
    );
};