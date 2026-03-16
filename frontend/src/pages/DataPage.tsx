import { useNavigate } from "react-router";

import { prepareSnapshotImport } from "@core";

import {
    useCategoryStore,
    useExpenseCategories,
    useIncomeCategories,
    useSettingsStore,
    useScenarioStore,
    useCashflowStore,
} from "@/store";
import type { Currency } from "@/store";

import { CategoryManagerCard } from "@/ui/components/settingsPage/CategoryManagerCard";
import { CurrencySelector } from "@/ui/components/settingsPage/CurrencySelector";
import { ImportExportCard } from "@/ui/components/settingsPage/ImportExportCard";
import { ScenarioManagerCard } from "@/ui/components/settingsPage/ScenarioManagerCard";
import { DangerZoneCard } from "@/ui/components/settingsPage/DangerZoneCard";
import type { ValidatedSnapshot } from "@/schemas/snapshot.schema";
import { exportToCsv, exportToJson, ImportError, importFromJson } from "@/services/export-import";
import { useFileInput } from "@/ui/hooks/useFileInput";

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

    const handleExportJson = () => {
        const scenarioIds = new Set(scenarios.map((s) => s.id));
        const filteredItems = Object.fromEntries(
            Object.entries(items).filter(([key]) => scenarioIds.has(key))
        );
        const snapshot = {
            version: 1 as const,
            exportedAt: new Date().toISOString(),
            scenarios,
            items: filteredItems,
            categories: useCategoryStore.getState().categories,
            currency,
        } satisfies ValidatedSnapshot;
        exportToJson(snapshot);
    };

    const handleExportCsv = () => {
        exportToCsv(scenarios, items);
    };

    const handleImportFile = async (file: File) => {
        try {
            const snapshot = await importFromJson(file);
            applySnapshot(snapshot);
        } catch (err) {
            if (err instanceof ImportError) {
                const detail = err.details ? `\n\nDetalle: ${err.details}` : "";
                alert(`${err.message}${detail}`);
            } else {
                alert("Error inesperado al importar.");
            }
        }
    };

    const applySnapshot = (snapshot: ValidatedSnapshot) => {
        const existingCategories = useCategoryStore.getState().categories;
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
            <div className="max-w-5xl mx-auto space-y-8">

                {/* ── Sección: Categorías ── */}
                <section className="space-y-4">
                    <SectionLabel label="Categorías" />
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
                </section>

                {/* ── Sección: Preferencias ── */}
                <section className="space-y-4">
                    <SectionLabel label="Preferencias" />
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
                </section>

                {/* ── Sección: Escenarios ── */}
                <section className="space-y-4">
                    <SectionLabel label="Escenarios" />
                    <ScenarioManagerCard
                        scenarios={scenarios}
                        onAdd={addScenario}
                        onRename={renameScenario}
                        onDelete={handleDeleteScenario}
                    />
                </section>

                {/* ── Zona peligrosa ── */}
                <DangerZoneCard onClearAllData={handleClearAllData} />

            </div>
        </div>
    );
};

// ── Helper: etiqueta de sección ───────────────────────────────────────────────
const SectionLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {label}
        </span>
        <div className="flex-1 h-px bg-border" />
    </div>
);