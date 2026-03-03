import { useCategoryStore, useExpenseCategories, useIncomeCategories } from "@/store/categoryStore";
import { useSettingsStore, type Currency } from "@/store/settingsStore";
import { useScenarioStore } from "@/store/scenarioStore";
import { CategoryManagerCard } from "@/ui/components/settingsPage/CategoryManagerCard";
import { CurrencySelector } from "@/ui/components/settingsPage/CurrencySelector";
import { ImportExportCard } from "@/ui/components/settingsPage/ImportExportCard";
import { ScenarioManagerCard } from "@/ui/components/settingsPage/ScenarioManagerCard";
import { DangerZoneCard } from "@/ui/components/settingsPage/DangerZoneCard";

export const DataPage = () => {
    const { addCategory, removeCategory, renameCategory, resetCategories } = useCategoryStore();
    const expenseCategories = useExpenseCategories();
    const incomeCategories = useIncomeCategories();

    const { currency, setCurrency } = useSettingsStore();

    const { scenarios, addScenario, renameScenario, removeScenario } = useScenarioStore();

    const handleExportJson = () => { /* TODO */ };
    const handleExportCsv = () => { /* TODO */ };
    const handleImport = () => { /* TODO */ };
    const handleClearAllData = () => { /* TODO */ };

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
                    onResetCategories={resetCategories}
                    onClearAllData={handleClearAllData}
                />

            </div>
        </div>
    );
};