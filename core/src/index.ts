export type { Frequency, CashflowItem, MonthlySummary, ISODateString, Scenario } from "./domain/models";
export { RANGED_FREQUENCIES, toISODateString, getFrequencyInterval } from "./domain/models";

export { isActiveMonth } from "./domain/rules/occurrence";
export { validateCashflowItem, assertCashflowItemValid } from "./domain/rules/cashflow-invariants";
export type { InvariantViolation } from "./domain/rules/cashflow-invariants";

export {
    calculateMonthlySummary,
    calculateAccumulatedSavings,
    calculateMonthlyIncome,
    calculateMonthlyExpenses,
    calculateNetBalance,
} from "./domain/services/monthly-calculator";

export { frequencyMonthsMap } from "./shared/constants/frequency-months-map";
export type { YearMonth } from "./shared/utils/date-utils";
export { monthDiff, addMonths, toISOFirstOfMonth, parseISODate } from "./shared/utils/date-utils";

export { createPlannedCashflowItem } from "./application/use-cases/create-planned-cashflow-item";
export type { CreatePlannedCashflowItemInput, NewPlannedCashflowItem } from "./application/use-cases/create-planned-cashflow-item";

export { projectBalanceSeries } from "./application/use-cases/project-balance-series";
export type { ProjectBalanceSeriesInput, BalanceSeriesPoint } from "./application/use-cases/project-balance-series";

export { prepareSnapshotImport } from "./application/use-cases/import-snapshot";
export type { AppSnapshotV1, ImportSnapshotResult, ImportedScenario } from "./application/use-cases/import-snapshot";
export type { Category as SnapshotCategory } from "./application/use-cases/import-snapshot.types";

// ✅ Regla de dominio de colchón de emergencia
export { calculateCushion } from "./domain/rules/cushion";
export type { CushionInputs, CushionResult, CushionBreakdownStep, LaborProfile, RiskProfile } from "./domain/rules/cushion";