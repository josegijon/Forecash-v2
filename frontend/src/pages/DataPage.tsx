import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, XCircle, X } from "lucide-react";

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

// ── Toast ─────────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error";

interface Toast {
    id: number;
    variant: ToastVariant;
    title: string;
    description?: string;
}

let toastCounter = 0;

const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const push = useCallback((variant: ToastVariant, title: string, description?: string) => {
        const id = ++toastCounter;
        setToasts((prev) => [...prev, { id, variant, title, description }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, push, dismiss };
};

// ── ToastStack ────────────────────────────────────────────────────────────────

const ToastStack = ({
    toasts,
    onDismiss,
}: {
    toasts: Toast[];
    onDismiss: (id: number) => void;
}) => (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
            <div
                key={t.id}
                className={`flex items-start gap-3 px-4 py-3 rounded-2xl shadow-lg border pointer-events-auto animate-in fade-in slide-in-from-bottom-2 max-w-sm ${t.variant === "success"
                    ? "bg-card border-border"
                    : "bg-card border-destructive/30"
                    }`}
            >
                {t.variant === "success" ? (
                    <CheckCircle size={16} className="text-success shrink-0 mt-0.5" />
                ) : (
                    <XCircle size={16} className="text-destructive shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{t.title}</p>
                    {t.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => onDismiss(t.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
                    aria-label="Cerrar notificación"
                >
                    <X size={14} />
                </button>
            </div>
        ))}
    </div>
);

// ── DataPage ──────────────────────────────────────────────────────────────────

export const DataPage = () => {
    const { addCategory, removeCategory, renameCategory, resetCategories } = useCategoryStore();
    const expenseCategories = useExpenseCategories();
    const incomeCategories = useIncomeCategories();

    const { currency, setCurrency } = useSettingsStore();
    const navigate = useNavigate();
    const { toasts, push, dismiss } = useToast();

    const { scenarios, addScenario, renameScenario, removeScenario, setActiveScenario } =
        useScenarioStore();
    const { items } = useCashflowStore();

    const handleDeleteScenario = (id: string) => {
        const newActiveId = removeScenario(id);
        if (newActiveId) {
            setActiveScenario(newActiveId);
            navigate(`/escenario/${newActiveId}/planificacion`);
        }
    };

    const handleExportJson = () => {
        try {
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
            push("success", "Exportación completada", "El archivo JSON se ha descargado.");
        } catch {
            push("error", "Error al exportar", "No se pudo generar el archivo JSON.");
        }
    };

    const handleExportCsv = () => {
        try {
            exportToCsv(scenarios, items);
            push("success", "Exportación completada", "El archivo CSV se ha descargado.");
        } catch {
            push("error", "Error al exportar", "No se pudo generar el archivo CSV.");
        }
    };

    const handleImportFile = async (file: File) => {
        try {
            const snapshot = await importFromJson(file);
            applySnapshot(snapshot);
            push(
                "success",
                "Importación completada",
                "Los escenarios se han añadido sin borrar los existentes.",
            );
        } catch (err) {
            if (err instanceof ImportError) {
                push("error", err.message, err.details ?? "Comprueba que el archivo es un JSON exportado desde Forecash.");
            } else {
                push("error", "Error inesperado al importar", "El archivo puede estar corrupto.");
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

    const hasData = scenarios.length > 0 || Object.values(items).some((arr) => arr.length > 0);

    return (
        <>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="max-w-5xl mx-auto space-y-10 pb-10">

                    {/* ── Categorías ── */}
                    <PageSection
                        label="Categorías"
                        description="Organiza tus ingresos y gastos"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    </PageSection>

                    {/* ── Preferencias ── */}
                    <PageSection
                        label="Preferencias"
                        description="Configuración general de la aplicación"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-4">
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
                    </PageSection>

                    {/* ── Escenarios ── */}
                    <PageSection
                        label="Escenarios"
                        description="Gestiona tus escenarios financieros"
                    >
                        <ScenarioManagerCard
                            scenarios={scenarios}
                            onAdd={addScenario}
                            onRename={renameScenario}
                            onDelete={handleDeleteScenario}
                        />
                    </PageSection>

                    {/* ── Zona peligrosa ── */}
                    <DangerZoneCard onClearAllData={handleClearAllData} hasData={hasData} />

                </div>
            </div>

            <ToastStack toasts={toasts} onDismiss={dismiss} />
        </>
    );
};

// ── PageSection ───────────────────────────────────────────────────────────────
const PageSection = ({
    label,
    description,
    children,
}: {
    label: string;
    description?: string;
    children: React.ReactNode;
}) => (
    <section className="space-y-4">
        <div className="flex items-baseline gap-3">
            <div>
                <h2 className="text-sm font-bold text-foreground tracking-tight">{label}</h2>
                {description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                )}
            </div>
            <div className="flex-1 h-px bg-border mt-1" />
        </div>
        {children}
    </section>
);