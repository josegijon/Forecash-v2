import type { Scenario } from "../../domain/models/scenario";
import type { CashflowItem } from "../../domain/models/cashflow-items";
import { Category } from "./import-snapshot.types";

export interface AppSnapshotV1 {
    version: number;
    exportedAt: string;
    scenarios: Scenario[];
    items: Record<string, CashflowItem[]>;
    categories: Category[];
    currency?: string;
}

export interface ImportedScenario {
    scenario: Omit<Scenario, "id">;
    items: Omit<CashflowItem, "id" | "scenarioId">[];
}

export interface ImportSnapshotResult {
    scenariosToImport: ImportedScenario[];
    categoriesToAdd: Category[];
    currency?: string;
}

/**
 * Transforma un snapshot de importación en instrucciones de aplicación.
 *
 * Reglas de negocio:
 *  - No importa categorías cuyo nombre ya exista (case-insensitive).
 *  - Desacopla los items de sus IDs originales de escenario (el store asignará nuevos IDs).
 *  - No tiene efectos secundarios: devuelve datos, no modifica stores.
 */
export const prepareSnapshotImport = (
    snapshot: AppSnapshotV1,
    existingCategories: Category[],
): ImportSnapshotResult => {
    const existingNames = new Set(
        existingCategories.map((c) => c.name.toLowerCase())
    );

    const categoriesToAdd = snapshot.categories.filter(
        (c) => !existingNames.has(c.name.toLowerCase())
    );

    const scenariosToImport: ImportedScenario[] = snapshot.scenarios.map((sc) => ({
        scenario: {
            name: sc.name,
            initialBalance: sc.initialBalance,
            savingsGoal: sc.savingsGoal,
            cushionBalance: sc.cushionBalance,
            capitalGoal: sc.capitalGoal,
        },
        items: (snapshot.items[sc.id] ?? []).map(({ id: _id, scenarioId: _sid, ...rest }) => rest),
    }));

    return {
        scenariosToImport,
        categoriesToAdd,
        currency: snapshot.currency,
    };
};