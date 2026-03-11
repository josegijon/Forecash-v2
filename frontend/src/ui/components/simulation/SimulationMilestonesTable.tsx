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
        <tr className="border-b border-border">
            {["Periodo", "Actual", scenarioName, "Diferencia"].map((col, i) => (
                <th
                    key={col}
                    className={`
                        h-10 px-3 sm:px-4 align-middle font-medium text-muted-foreground
                        text-xs
                        ${i === 0 ? "text-left" : "text-right"}
                        ${i === 1 ? "hidden xs:table-cell" : ""}
                    `}
                >
                    {/* En móvil muy estrecho, "Actual" se omite para dar espacio */}
                    {col}
                </th>
            ))}
        </tr>
    </thead>
);

export const SimulationMilestonesTable = ({
    data,
    scenarioName,
    selectedMonths,
}: SimulationMilestonesTableProps) => (
    <div className="rounded-3xl border-0 bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="flex flex-col space-y-1 p-4 sm:p-6 pb-0">
            <h3 className="font-medium tracking-tight text-base sm:text-lg">
                Resumen por hitos
            </h3>
        </div>

        <div className="p-4 sm:p-6 pt-3 sm:pt-4">
            <div className="w-full overflow-x-auto rounded-xl">
                <table className="w-full caption-bottom text-sm">
                    <MilestoneTableHead scenarioName={scenarioName} />
                    <tbody className="[&_tr:last-child]:border-0">
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
    </div>
);