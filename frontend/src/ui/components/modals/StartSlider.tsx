import type { FocusEvent } from "react";
import { addMonths } from "@core";
import { MONTH_NAMES } from "../../utils/projectionConstants";

interface StartInputProps {
    value: number;
    onChange: (v: number) => void;
}

const getMonthLabel = (offsetMonths: number): string => {
    if (offsetMonths === 0) return "Comienza ahora";
    const now = new Date();
    const { year, month } = addMonths({ year: now.getFullYear(), month: now.getMonth() }, offsetMonths);
    return `Comienza en ${MONTH_NAMES[month]} de ${year}`;
};

export const StartInput = ({ value, onChange }: StartInputProps) => {
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const parsed = parseInt(e.target.value, 10);
        if (isNaN(parsed) || parsed < 0) return onChange(0);
        if (parsed > 24) return onChange(24);
        onChange(parsed);
    };

    return (
        <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Inicia dentro de
            </label>
            <div className="relative">
                <input
                    type="number"
                    min={0}
                    max={24}
                    defaultValue={value}
                    key={value}
                    onBlur={handleBlur}
                    placeholder="0"
                    className="w-full px-4 py-2.5 pr-16 bg-muted/40 rounded-xl border border-border/60 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    meses
                </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{getMonthLabel(value)}</p>
        </div>
    );
};