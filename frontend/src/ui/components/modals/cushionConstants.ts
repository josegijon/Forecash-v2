import type { LaborProfile, RiskProfile } from "@core";

export const LABOR_OPTIONS: Array<{ value: LaborProfile; label: string }> = [
    { value: "funcionario", label: "Funcionario / Fijo" },
    { value: "empleado", label: "Empleado" },
    { value: "autonomo", label: "Autónomo" },
];

export const RISK_OPTIONS: Array<{ value: RiskProfile; label: string; sublabel: string }> = [
    { value: "justo", label: "Justo", sublabel: "Lo mínimo necesario" },
    { value: "equilibrado", label: "Equilibrado", sublabel: "Estándar recomendado" },
    { value: "conservador", label: "Conservador", sublabel: "Máximo margen" },
];