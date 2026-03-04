import { useCategoryStore, useExpenseCategories, useIncomeCategories } from "@/store/categoryStore";
import { useSettingsStore, type Currency } from "@/store/settingsStore";
import { useScenarioStore } from "@/store/scenarioStore";
import { useCashflowStore } from "@/store/cashflowStore";
import { CategoryManagerCard } from "@/ui/components/settingsPage/CategoryManagerCard";
import { CurrencySelector } from "@/ui/components/settingsPage/CurrencySelector";
import { ImportExportCard } from "@/ui/components/settingsPage/ImportExportCard";
import { ScenarioManagerCard } from "@/ui/components/settingsPage/ScenarioManagerCard";
import { DangerZoneCard } from "@/ui/components/settingsPage/DangerZoneCard";
import { exportToCsv, exportToJson, importFromJson, type AppSnapshot } from "@/infrastructure/export-import";
import { useFileInput } from "@/ui/components/settingsPage/useFileInput";

export const DataPage = () => {
    const { addCategory, removeCategory, renameCategory, resetCategories } = useCategoryStore();
    const expenseCategories = useExpenseCategories();
    const incomeCategories = useIncomeCategories();

    const { currency, setCurrency } = useSettingsStore();

    const { scenarios, addScenario, renameScenario, removeScenario } = useScenarioStore();
    const { items } = useCashflowStore();

    // ── Export JSON ──
    const handleExportJson = () => {
        const snapshot: AppSnapshot = {
            version: 1,
            exportedAt: new Date().toISOString(),
            scenarios,
            items,
            categories: useCategoryStore.getState().categories,
            currency,
        };
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
            alert((err as Error).message);
        }
    };

    const applySnapshot = (snapshot: AppSnapshot) => {
        const cashflowStore = useCashflowStore.getState();
        const scenarioStore = useScenarioStore.getState();
        const categoryStore = useCategoryStore.getState();
        const settingsStore = useSettingsStore.getState();

        snapshot.scenarios.forEach((oldScenario) => {
            // 1. Crear nuevo escenario con nombre del importado
            const newId = scenarioStore.addScenario(oldScenario.name);

            // 2. Copiar campos financieros del escenario original
            scenarioStore.setInitialBalance(newId, oldScenario.initialBalance);
            scenarioStore.setSavingsGoal(newId, oldScenario.savingsGoal);
            scenarioStore.setCushionBalance(newId, oldScenario.cushionBalance);

            // 3. Importar sus items con el nuevo ID
            const scenarioItems = snapshot.items[oldScenario.id] ?? [];
            scenarioItems.forEach((item) => {
                cashflowStore.addItem({ ...item, scenarioId: newId });
            });
        });

        // 4. Importar categorías (solo las que no existan ya)
        const existingNames = categoryStore.categories.map((c) => c.name);
        snapshot.categories.forEach((c) => {
            if (!existingNames.includes(c.name)) {
                categoryStore.addCategory(c.name, c.type);
            }
        });

        // 5. Moneda
        if (snapshot.currency) {
            settingsStore.setCurrency(snapshot.currency);
        }
    };

    const handleImport = useFileInput(".json", handleImportFile);

    // ── Clear all data ──
    const handleClearAllData = () => {
        // Limpiar todos los stores de Zustand
        const cashflowStore = useCashflowStore.getState();
        const scenarioStore = useScenarioStore.getState();

        scenarioStore.scenarios.forEach((s) => cashflowStore.removeAllByScenario(s.id));
        scenarioStore.removeAllScenarios();
        resetCategories();

        // Limpiar localStorage por completo y recargar
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Fila 1 — Categorías */}
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

                {/* Fila 2 — Moneda + Import/Export */}
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

                {/* Fila 3 — Escenarios */}
                <ScenarioManagerCard
                    scenarios={scenarios}
                    onAdd={addScenario}
                    onRename={renameScenario}
                    onDelete={removeScenario}
                />

                {/* Fila 4 — Zona peligrosa */}
                <DangerZoneCard
                    onClearAllData={handleClearAllData}
                />

            </div>
        </div>
    );
};