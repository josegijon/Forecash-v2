import { Clock } from "lucide-react";

import { type DataPoint } from "./types";
import { MilestoneRow } from "./MilestoneRow";

interface SimulationMilestonesTableProps {
    data: DataPoint[];
    scenarioName: string;
    selectedMonths: number;
}

const MILESTONES = [3, 6, 12, 24, 60];

const MilestoneTableHead = ({ scenarioName }: { scenarioName: string }) => (
    <thead>
        <tr className="border-b border-slate-200">
            {["Periodo", "Actual", scenarioName, "Diferencia"].map((col, i) => (
                <th
                    key={col}
                    className={`py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider ${i === 0 ? "text-left" : "text-right"}`}
                >
                    {col}
                </th>
            ))}
        </tr>
    </thead>
);

export const SimulationMilestonesTable = ({ data, scenarioName, selectedMonths }: SimulationMilestonesTableProps) => (
    <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
            <Clock size={20} className="text-primary" />
            <h3 className="font-bold text-slate-900">Resumen por hitos</h3>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <MilestoneTableHead scenarioName={scenarioName} />
                <tbody>
                    {MILESTONES.filter((m) => m <= selectedMonths).map((m) => (
                        <MilestoneRow
                            key={m}
                            milestone={m}
                            point={data[Math.min(m, data.length - 1)]}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);