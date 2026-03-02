
import { useState } from "react";

import { SimulationHeader } from "@/ui/components/simulation/SimulationHeader";
import { SimulationMilestonesTable } from "@/ui/components/simulation/SimulationMilestonesTable";
import { SimulationChart } from "@/ui/components/simulation/SimulationChart";
import { SimulationSummaryCards } from "@/ui/components/simulation/SimulationSummaryCards";

/* ─── Datos mock ─── */

const SCENARIOS = [
    { id: "current", name: "Escenario Actual" },
    { id: "optimista", name: "Escenario Optimista" },
    { id: "conservador", name: "Escenario Conservador" },
];

const generateMockData = (months: number) => {
    const data = [];
    let currentBalance = 5000;
    let altBalance = 5000;

    const monthNames = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];

    const startDate = new Date(2026, 1); // Feb 2026

    for (let i = 0; i <= months; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);
        const label = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;

        currentBalance += Math.round(300 + Math.random() * 200 - 80);
        altBalance += Math.round(450 + Math.random() * 300 - 60);

        data.push({
            month: label,
            actual: currentBalance,
            comparado: altBalance,
            diferencia: altBalance - currentBalance,
        });
    }

    return data;
};

export const SimulationPage = () => {
    const [selectedMonths, setSelectedMonths] = useState(12);
    const [selectedScenario, setSelectedScenario] = useState("optimista");

    const data = generateMockData(selectedMonths);
    const lastPoint = data[data.length - 1];

    const scenarioName =
        SCENARIOS.find((s) => s.id === selectedScenario)?.name ?? "Escenario";

    return (
        <div className="flex-1 scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-6">
                <SimulationHeader
                    selectedScenario={selectedScenario}
                    selectedMonths={selectedMonths}
                    onScenarioChange={setSelectedScenario}
                    onMonthsChange={setSelectedMonths}
                    onCopyScenario={() => alert("TODO: Crear copia del escenario actual")}
                />

                <SimulationSummaryCards
                    actualBalance={lastPoint.actual}
                    comparedBalance={lastPoint.comparado}
                    scenarioName={scenarioName}
                    selectedMonths={selectedMonths}
                />

                <SimulationChart
                    data={data}
                    scenarioName={scenarioName}
                    selectedMonths={selectedMonths}
                />

                <SimulationMilestonesTable
                    data={data}
                    scenarioName={scenarioName}
                    selectedMonths={selectedMonths}
                />
            </div>
        </div>
    );
};
