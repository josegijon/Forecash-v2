import { ChevronDown } from "lucide-react";

import { TIME_OPTIONS } from "../projection/projectionTypes";

interface ProjectionHorizonSelectProps {
    selectedMonths: number;
    onMonthsChange: (months: number) => void;
}

export const ProjectionHorizonSelect = ({ selectedMonths, onMonthsChange }: ProjectionHorizonSelectProps) => {
    return (
        <div className="relative group">
            <select
                value={selectedMonths}
                onChange={(e) => onMonthsChange(Number(e.target.value))}
                className="appearance-none bg-white border border-slate-200 hover:border-blue-300 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer transition-all hover:shadow-md"
            >
                {TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-600 transition-colors">
                <ChevronDown
                    size={16}
                    strokeWidth={2.5}
                    className="transition-transform group-focus-within:rotate-180"
                />
            </div>
        </div>
    )
}
