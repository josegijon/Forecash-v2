import type { LaborProfile, RiskProfile } from "@core";

export {
    calculateCushion,
    type LaborProfile,
    type RiskProfile,
    type CushionInputs,
    type CushionBreakdownStep,
    type CushionResult,
} from "@core";

// ── Constantes de presentación (solo UI, no van al core) ──────────────────

export const LABOR_OPTIONS: Array<{ value: LaborProfile; label: string; emoji: string }> = [
    { value: "funcionario", label: "Funcionario / Contrato fijo", emoji: "🏛️" },
    { value: "empleado", label: "Empleado por cuenta ajena", emoji: "💼" },
    { value: "autonomo", label: "Freelance / Autónomo", emoji: "🧑‍💻" },
];

export const RISK_OPTIONS: Array<{ value: RiskProfile; label: string; emoji: string; sublabel: string }> = [
    { value: "justo", label: "Justo lo necesario", emoji: "⚡", sublabel: "Prefiero tener ese dinero disponible" },
    { value: "equilibrado", label: "Equilibrado", emoji: "⚖️", sublabel: "El estándar recomendado" },
    { value: "conservador", label: "Conservador", emoji: "🛡️", sublabel: "Prefiero dormir tranquilo/a" },
];