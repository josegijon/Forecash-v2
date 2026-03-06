export type LaborProfile = "funcionario" | "empleado" | "autonomo";
export type RiskProfile = "conservador" | "equilibrado" | "justo";

export interface CushionInputs {
    laborProfile: LaborProfile;
    hasDependants: boolean;
    hasFixedDebt: boolean;
    riskProfile: RiskProfile;
}

export interface CushionBreakdownStep {
    label: string;
    months: number;
    sign: "+" | "=";
    description: string;
}

export interface CushionResult {
    totalMonths: number;
    totalAmount: number;
    breakdown: CushionBreakdownStep[];
}

// ── Tablas de referencia ────────────────────────────────────────────────────

const LABOR_MONTHS: Record<LaborProfile, { base: number; label: string; description: string }> = {
    funcionario: {
        base: 3,
        label: "Funcionario / Contrato fijo",
        description: "Alta estabilidad laboral. Riesgo de pérdida de ingresos muy bajo.",
    },
    empleado: {
        base: 4,
        label: "Empleado por cuenta ajena",
        description: "Estabilidad media. Depende de la facilidad de encontrar nuevo empleo.",
    },
    autonomo: {
        base: 8,
        label: "Freelance / Autónomo",
        description: "Ingresos variables y menor red de protección estatal.",
    },
};

const RISK_MULTIPLIER: Record<RiskProfile, { factor: number; label: string; description: string }> = {
    justo: {
        factor: 0.85,
        label: "Justo lo necesario",
        description: "Prefiero tener ese dinero disponible o invertido.",
    },
    equilibrado: {
        factor: 1.0,
        label: "Equilibrado",
        description: "El estándar recomendado para mi perfil.",
    },
    conservador: {
        factor: 1.25,
        label: "Conservador (dormir tranquilo)",
        description: "Prefiero un margen extra ante cualquier imprevisto.",
    },
};

/**
 * Calcula el colchón de emergencia recomendado dado un perfil de usuario.
 * Función pura — no depende de React ni de stores.
 */
export const calculateCushion = (
    inputs: CushionInputs,
    monthlyFixedExpenses: number,
): CushionResult => {
    const labor = LABOR_MONTHS[inputs.laborProfile];
    const risk = RISK_MULTIPLIER[inputs.riskProfile];

    const breakdown: CushionBreakdownStep[] = [];
    let accumulated = labor.base;

    breakdown.push({
        label: labor.label,
        months: labor.base,
        sign: "=",
        description: labor.description,
    });

    if (inputs.hasDependants) {
        breakdown.push({
            label: "Personas a cargo",
            months: 2,
            sign: "+",
            description: "Con dependientes el margen de error debe ser mayor.",
        });
        accumulated += 2;
    }

    if (inputs.hasFixedDebt) {
        breakdown.push({
            label: "Deuda con cuota fija (hipoteca / préstamo)",
            months: 1,
            sign: "+",
            description: "Una cuota impagada tiene consecuencias inmediatas.",
        });
        accumulated += 1;
    }

    const afterRisk = Math.round(accumulated * risk.factor * 2) / 2;
    const riskDelta = Math.round((afterRisk - accumulated) * 2) / 2;

    if (riskDelta !== 0) {
        breakdown.push({
            label: `Perfil de riesgo: ${risk.label}`,
            months: riskDelta,
            sign: "+",
            description: risk.description,
        });
    }

    return {
        totalMonths: afterRisk,
        totalAmount: Math.round(afterRisk * monthlyFixedExpenses),
        breakdown,
    };
};