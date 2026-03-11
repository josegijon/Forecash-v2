import { useEffect, useRef, useState } from "react";
import { Copy, ChevronDown } from "lucide-react";

import { useScenarioStore } from "@/store";
import { ProjectionHorizonSelect } from "../controls/ProjectionHorizonSelect";

interface SimulationHeaderProps {
    selectedScenario: string;
    selectedMonths: number;
    onScenarioChange: (id: string) => void;
    onMonthsChange: (months: number) => void;
    onCopyScenario: () => void;
}

export const SimulationHeader = ({ selectedScenario, selectedMonths, onScenarioChange, onMonthsChange, onCopyScenario }: SimulationHeaderProps) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const scenarios = useScenarioStore((s) => s.scenarios);
    const selectedScenarioName =
        scenarios.find((s) => s.id === selectedScenario)?.name ?? "Escenario";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                onClick={onCopyScenario}
            >
                <Copy size={16} strokeWidth={2.5} />
                Crear copia del escenario
            </button>

            <div className="flex flex-wrap items-center gap-3">
                <div ref={containerRef} className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-medium ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mr-2 cursor-pointer appearance-none transition-all ease-in-out duration-300"
                    >
                        <span className="capitalize">
                            {selectedScenarioName}
                        </span>
                        <ChevronDown size={14} className="transition-transform group-focus-within:rotate-180" />
                    </button>

                    {open && (
                        <div className="absolute left-0 mt-2  shadow-lg z-50 flex flex-col cursor-pointer appearance-none border border-input bg-background  hover:text-accent-foreground rounded-3xl text-sm font-medium overflow-hidden">
                            {scenarios.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        onScenarioChange(s.id);
                                        setOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent cursor-pointer`}
                                >
                                    vs {s.name}
                                </button>
                            ))}
                        </div>
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