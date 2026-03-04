import { useScenarioStore } from "@/store";
import { Copy, ChevronDown } from "lucide-react";
import { ProjectionHorizonSelect } from "../controls/ProjectionHorizonSelect";

interface Props {
    selectedScenario: string;
    selectedMonths: number;
    onScenarioChange: (id: string) => void;
    onMonthsChange: (months: number) => void;
    onCopyScenario: () => void;
}

export const SimulationHeader = ({ selectedScenario, selectedMonths, onScenarioChange, onMonthsChange, onCopyScenario }: Props) => {

    const scenarios = useScenarioStore((s) => s.scenarios);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 cursor-pointer"
                onClick={onCopyScenario}
            >
                <Copy size={16} strokeWidth={2.5} />
                Crear copia del escenario
            </button>

            <div className="flex items-center gap-3">
                <div className="relative group">
                    <select
                        value={selectedScenario}
                        onChange={(e) => onScenarioChange(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 hover:border-blue-300 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer transition-all hover:shadow-md"
                    >
                        {scenarios.map((s) => (
                            <option
                                key={s.id}
                                value={s.id}
                            >
                                vs {s.name}
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

                <ProjectionHorizonSelect
                    selectedMonths={selectedMonths}
                    onMonthsChange={onMonthsChange}
                />
            </div>
        </div>
    );
};