import { useState, useEffect, useRef } from "react";
import { Copy, ChevronDown } from "lucide-react";

import { useScenarioStore, useActiveScenario } from "@/store";
import { ProjectionHorizonSelect } from "../controls/ProjectionHorizonSelect";

interface SimulationHeaderProps {
    selectedScenario: string;
    selectedMonths: number;
    onScenarioChange: (id: string) => void;
    onMonthsChange: (months: number) => void;
    onCopyScenario: () => void;
}

export const SimulationHeader = ({
    selectedScenario,
    selectedMonths,
    onScenarioChange,
    onMonthsChange,
    onCopyScenario,
}: SimulationHeaderProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const scenarios = useScenarioStore((s) => s.scenarios);
    const activeScenario = useActiveScenario();

    const activeScenarioName = activeScenario?.name ?? "Escenario base";
    const selectedScenarioName = scenarios.find((s) => s.id === selectedScenario)?.name ?? "Escenario";

    // Cierra el dropdown al hacer clic fuera
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
                onClick={onCopyScenario}
                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold transition-colors cursor-pointer"
            >
                <Copy size={16} strokeWidth={2.5} />
                Simular cambio
            </button>

            <div className="flex flex-wrap items-center gap-3">

                {/* Selector de escenario de comparación */}
                <div ref={ref} className="relative">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {activeScenarioName} vs
                        </span>
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                            className="inline-flex items-center gap-2 py-2 px-3 rounded-xl border border-border/60 bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                            aria-haspopup="listbox"
                            aria-expanded={open}
                        >
                            <span>{selectedScenarioName}</span>
                            <ChevronDown
                                size={14}
                                className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                            />
                        </button>
                    </div>

                    {open && (
                        <ul
                            role="listbox"
                            className="absolute right-0 mt-1.5 z-50 min-w-full border border-border bg-card rounded-xl shadow-lg overflow-hidden py-1"
                        >
                            {scenarios.map((s) => {
                                const isSelected = s.id === selectedScenario;
                                return (
                                    <li
                                        key={s.id}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => { onScenarioChange(s.id); setOpen(false); }}
                                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${isSelected
                                            ? "text-primary font-semibold bg-primary/5"
                                            : "text-foreground font-medium hover:bg-muted"
                                            }`}
                                    >
                                        {s.name}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <ProjectionHorizonSelect
                    selectedMonths={selectedMonths}
                    onMonthsChange={onMonthsChange}
                />
            </div>
        </div>
    );
};