import { useCallback, useMemo, useState } from "react";

import { SimulationHeader } from "@/ui/components/simulation/SimulationHeader";
import { SimulationMilestonesTable } from "@/ui/components/simulation/SimulationMilestonesTable";
import { SimulationChart } from "@/ui/components/simulation/SimulationChart";
import { SimulationSummaryCards } from "@/ui/components/simulation/SimulationSummaryCards";
import { useActiveScenario, useCashflowStore, useScenarioItems, useScenarioStore } from "@/store";
import { useSettingsStore } from "@/store";

import { calculateAccumulatedSavings } from "../../../core/src/domain/services/monthly-calculator";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/* ─── Hook: genera los puntos del gráfico para un escenario ─── */

const useScenarioChartData = (
    scenarioId: string,
    months: number,
    initialBalance: number,
) => {
    const items = useScenarioItems(scenarioId);

    return useMemo(() => {
        const now = new Date();
        const refYear = now.getFullYear();
        const refMonth = now.getMonth();
        const data = [];

        for (let i = 0; i <= months; i++) {
            const date = new Date(refYear, refMonth + i);
            const year = date.getFullYear();
            const month = date.getMonth();
            const label = `${MONTH_NAMES[month]} ${date.getFullYear().toString().slice(-2)}`;

            const balance = calculateAccumulatedSavings(
                items,
                initialBalance,
                refYear,
                refMonth,
                year,
                month,
            );

            data.push({ month: label, balance, year, monthLabel: label });
        }

        return data;
    }, [items, months, initialBalance, scenarioId]);
};

/* ─── Componente principal ─── */

export const SimulationPage = () => {
    const [selectedMonths, setSelectedMonths] = useState(12);
    const [selectedScenario, setSelectedScenario] = useState<string>("");

    const scenarios = useScenarioStore((s) => s.scenarios);
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
    const duplicateScenario = useScenarioStore((s) => s.duplicateScenario);
    const duplicateScenarioItems = useCashflowStore((s) => s.duplicateScenarioItems);
    const activeScenario = useActiveScenario();
    const initialBalance = activeScenario?.initialBalance ?? 0;


    // El escenario comparado: si no hay selección, usamos el segundo escenario disponible (si existe)
    const comparedScenarioId = selectedScenario ||
        scenarios.find((s) => s.id !== activeScenarioId)?.id ||
        activeScenarioId;

    const scenarioName =
        scenarios.find((s) => s.id === comparedScenarioId)?.name ?? "Escenario";

    const handleCopyScenario = useCallback(() => {
        const newScenarioId = duplicateScenario(activeScenarioId);
        if (newScenarioId) {
            duplicateScenarioItems(activeScenarioId, newScenarioId);
        }
    }, [activeScenarioId, duplicateScenario, duplicateScenarioItems]);

    // Datos reales por escenario
    const actualItems = useScenarioItems(activeScenarioId);
    const comparedItems = useScenarioItems(comparedScenarioId);

    const chartData = useMemo(() => {
        const now = new Date();
        const refYear = now.getFullYear();
        const refMonth = now.getMonth();
        const data = [];

        for (let i = 0; i <= selectedMonths; i++) {
            const date = new Date(refYear, refMonth + i);
            const year = date.getFullYear();
            const month = date.getMonth();
            const label = `${MONTH_NAMES[month]} ${date.getFullYear().toString().slice(-2)}`;

            const actual = calculateAccumulatedSavings(
                actualItems,
                initialBalance,
                refYear,
                refMonth,
                year,
                month,
            );

            const comparado = calculateAccumulatedSavings(
                comparedItems,
                initialBalance,
                refYear,
                refMonth,
                year,
                month,
            );

            data.push({
                month: label,
                actual,
                comparado,
                diferencia: comparado - actual,
            });
        }

        return data;
    }, [actualItems, comparedItems, selectedMonths, initialBalance]);

    const lastPoint = chartData[chartData.length - 1];

    return (
        <div className="flex-1 scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-6">
                <SimulationHeader
                    selectedScenario={comparedScenarioId}
                    selectedMonths={selectedMonths}
                    onScenarioChange={setSelectedScenario}
                    onMonthsChange={setSelectedMonths}
                    onCopyScenario={handleCopyScenario}
                />

                <SimulationSummaryCards
                    actualBalance={lastPoint.actual}
                    comparedBalance={lastPoint.comparado}
                    scenarioName={scenarioName}
                    selectedMonths={selectedMonths}
                />

                <SimulationChart
                    data={chartData}
                    scenarioName={scenarioName}
                    selectedMonths={selectedMonths}
                />

                <SimulationMilestonesTable
                    data={chartData}
                    scenarioName={scenarioName}
                    selectedMonths={selectedMonths}
                />
            </div>
        </div>
    );
};