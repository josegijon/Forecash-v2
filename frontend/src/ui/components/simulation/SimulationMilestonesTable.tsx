import { type DataPoint } from "./types";
import { MilestoneRow } from "./MilestoneRow";
import { MilestoneMobileCard } from "./MilestoneMobileCard";

interface SimulationMilestonesTableProps {
    data: DataPoint[];
    scenarioName: string;
    selectedMonths: number;
}

const BASE_MILESTONES = [3, 6, 12, 24, 60];

const buildMilestones = (selectedMonths: number): number[] => {
    const base = BASE_MILESTONES.filter((m) => m < selectedMonths);
    return [...base, selectedMonths];
};

const MilestoneTableHead = ({ scenarioName }: { scenarioName: string }) => (
    <thead>
        <tr className="border-b border-border">
            {["Periodo", "Actual", scenarioName, "Diferencia"].map((col, i) => (
                <th
                    key={col}
                    className={`h-10 px-3 sm:px-4 align-middle font-medium text-muted-foreground text-xs ${i === 0 ? "text-left" : "text-right"}`}
                >
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
}: SimulationMilestonesTableProps) => {
    const milestones = buildMilestones(selectedMonths).filter((m) => m < data.length);

    if (milestones.length === 0) {
        return (
            <div className="rounded-3xl border border-border bg-card text-card-foreground shadow-sm p-6 text-center text-sm">
                Sin datos suficientes para mostrar el resumen por hitos.
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="flex flex-col space-y-1 p-4 sm:p-6 pb-0">
                <h3 className="font-medium tracking-tight text-base sm:text-lg">
                    Resumen por hitos
                </h3>
            </div>

            <div className="p-4 sm:p-6 pt-3 sm:pt-4">

                {/* ── Desktop ── */}
                <div className="hidden sm:block">
                    <table className="w-full caption-bottom text-sm">
                        <MilestoneTableHead scenarioName={scenarioName} />
                        <tbody className="[&_tr:last-child]:border-0">
                            {milestones.map((m) => (
                                <MilestoneRow
                                    key={m}
                                    milestone={m}
                                    point={data[m]}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile ── */}
                <div className="sm:hidden">
                    {milestones.map((m) => (
                        <MilestoneMobileCard
                            key={m}
                            milestone={m}
                            point={data[m]}
                            scenarioName={scenarioName}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};