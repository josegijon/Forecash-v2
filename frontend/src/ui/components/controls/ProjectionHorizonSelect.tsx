import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { TIME_OPTIONS } from "../../utils/projectionConstants";

interface ProjectionHorizonSelectProps {
    selectedMonths: number;
    onMonthsChange: (months: number) => void;
}

export const ProjectionHorizonSelect = ({ selectedMonths, onMonthsChange }: ProjectionHorizonSelectProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
                <span>
                    {TIME_OPTIONS.find((o) => o.value === selectedMonths)?.label ?? `${selectedMonths} meses`}
                </span>
                <ChevronDown
                    size={14}
                    className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute left-0 mt-1.5 z-50 min-w-full border border-border bg-card rounded-xl shadow-lg overflow-hidden py-1">
                    {TIME_OPTIONS.map((opt) => {
                        const isSelected = opt.value === selectedMonths;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => { onMonthsChange(opt.value); setOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${isSelected
                                    ? "text-primary font-semibold bg-primary/10"
                                    : "text-foreground font-medium hover:bg-muted"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};