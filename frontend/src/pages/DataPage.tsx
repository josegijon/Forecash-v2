import { useNavigate } from "react-router";

import { prepareSnapshotImport } from "@core";

import { useCategoryStore, useExpenseCategories, useIncomeCategories } from "@/store/categoryStore";
import { useSettingsStore, type Currency } from "@/store/settingsStore";
import { useScenarioStore } from "@/store/scenarioStore";
import { useCashflowStore } from "@/store/cashflowStore";
import { CategoryManagerCard } from "@/ui/components/settingsPage/CategoryManagerCard";
import { CurrencySelector } from "@/ui/components/settingsPage/CurrencySelector";
import { ImportExportCard } from "@/ui/components/settingsPage/ImportExportCard";
import { ScenarioManagerCard } from "@/ui/components/settingsPage/ScenarioManagerCard";
import { DangerZoneCard } from "@/ui/components/settingsPage/DangerZoneCard";
import { useFileInput } from "@/ui/components/settingsPage/useFileInput";
import type { ValidatedSnapshot } from "@/schemas/snapshot.schema";
import { exportToCsv, exportToJson, ImportError, importFromJson } from "@/infrastructure/export-import";

export const DataPage = () => {
    const { addCategory, removeCategory, renameCategory, resetCategories } = useCategoryStore();
    const expenseCategories = useExpenseCategories();
    const incomeCategories = useIncomeCategories();

    const { currency, setCurrency } = useSettingsStore();
    const navigate = useNavigate();

    const { scenarios, addScenario, renameScenario, removeScenario, setActiveScenario } = useScenarioStore();
    const { items } = useCashflowStore();

    const handleDeleteScenario = (id: string) => {
        const newActiveId = removeScenario(id);
        if (newActiveId) {
            setActiveScenario(newActiveId);
            navigate(`/escenario/${newActiveId}/planificacion`);
        }
    };

    // ── Export JSON ──
    const handleExportJson = () => {
        const snapshot = {
            version: 1 as const,
            exportedAt: new Date().toISOString(),
            scenarios,
            items,
            categories: useCategoryStore.getState().categories,
            currency,
        } satisfies ValidatedSnapshot;
        exportToJson(snapshot);
    };

    // ── Export CSV ──
    const handleExportCsv = () => {
        exportToCsv(scenarios, items);
    };

    // ── Import JSON ──
    const handleImportFile = async (file: File) => {
        try {
            const snapshot = await importFromJson(file);
            applySnapshot(snapshot);
        } catch (err) {
            if (err instanceof ImportError) {
                // Permite diferenciar el tipo de error en UI si se desea
                const detail = err.details ? `\n\nDetalle: ${err.details}` : "";
                alert(`${err.message}${detail}`);
            } else {
                alert("Error inesperado al importar.");
            }
        }
    };

    // ── applySnapshot: orquesta stores a partir del resultado puro del core ──
    const applySnapshot = (snapshot: ValidatedSnapshot) => {
        const existingCategories = useCategoryStore.getState().categories;

        // El core calcula qué importar sin tocar stores
        const { scenariosToImport, categoriesToAdd, currency: snapshotCurrency } =
            prepareSnapshotImport(snapshot, existingCategories);

        const scenarioStore = useScenarioStore.getState();
        const cashflowStore = useCashflowStore.getState();
        const categoryStore = useCategoryStore.getState();
        const settingsStore = useSettingsStore.getState();

        scenariosToImport.forEach(({ scenario, items: scenarioItems }) => {
            const newId = scenarioStore.addScenario(scenario.name);
            scenarioStore.setInitialBalance(newId, scenario.initialBalance);
            scenarioStore.setSavingsGoal(newId, scenario.savingsGoal);
            scenarioStore.setCushionBalance(newId, scenario.cushionBalance);
            if (scenario.capitalGoal !== undefined) {
                scenarioStore.setCapitalGoal(newId, scenario.capitalGoal);
            }
            scenarioItems.forEach((item) => {
                cashflowStore.addItem({ ...item, scenarioId: newId });
            });
        });

        categoriesToAdd.forEach((c) => categoryStore.addCategory(c.name, c.type));

        if (snapshotCurrency) {
            settingsStore.setCurrency(snapshotCurrency as Currency);
        }
    };

    const handleImport = useFileInput(".json", handleImportFile);

    // ── Clear all data ──
    const handleClearAllData = () => {
        const cashflowStore = useCashflowStore.getState();
        const scenarioStore = useScenarioStore.getState();
        scenarioStore.scenarios.forEach((s) => cashflowStore.removeAllByScenario(s.id));
        scenarioStore.removeAllScenarios();
        resetCategories();
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CategoryManagerCard
                        type="expense"
                        categories={expenseCategories}
                        onAdd={(name) => addCategory(name, "expense")}
                        onRename={renameCategory}
                        onDelete={removeCategory}
                    />
                    <CategoryManagerCard
                        type="income"
                        categories={incomeCategories}
                        onAdd={(name) => addCategory(name, "income")}
                        onRename={renameCategory}
                        onDelete={removeCategory}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CurrencySelector
                        value={currency}
                        onChange={(code) => setCurrency(code as Currency)}
                    />
                    <ImportExportCard
                        onExportJson={handleExportJson}
                        onExportCsv={handleExportCsv}
                        onImport={handleImport}
                    />
                </div>

                <ScenarioManagerCard
                    scenarios={scenarios}
                    onAdd={addScenario}
                    onRename={renameScenario}
                    onDelete={handleDeleteScenario}
                />

                <DangerZoneCard onClearAllData={handleClearAllData} />
            </div>
        </div>
    );
};