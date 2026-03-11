import { ChevronDown } from "lucide-react";

import { TIME_OPTIONS } from "../projection/projectionTypes";
import { useEffect, useRef, useState } from "react";

interface ProjectionHorizonSelectProps {
    selectedMonths: number;
    onMonthsChange: (months: number) => void;
}

export const ProjectionHorizonSelect = ({ selectedMonths, onMonthsChange }: ProjectionHorizonSelectProps) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-medium ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mr-2 cursor-pointer appearance-none transition-all ease-in-out duration-300"
            >
                <span className="capitalize">
                    {selectedMonths} meses
                </span>
                <ChevronDown size={14} className="transition-transform group-focus-within:rotate-180" />
            </button>

            {open && (
                <div className="absolute left-0 mt-2 shadow-lg z-50 flex flex-col cursor-pointer appearance-none border border-input bg-background  hover:text-accent-foreground rounded-3xl text-sm font-medium overflow-hidden">
                    {TIME_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onMonthsChange(opt.value);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-accent cursor-pointer`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};