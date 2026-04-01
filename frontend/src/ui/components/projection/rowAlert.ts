import type { MonthData } from "../../utils/projectionTypes";

export type AlertLevel = "danger" | "warning" | "neutral" | null;

export const getAlertLevel = (row: MonthData): AlertLevel => {
    if (row.isNegativeBalance) return "danger";
    if (row.isPeakExpense) return "warning";
    if (row.isNegativeCashflow) return "neutral";
    return null;
};

export const hasAlert = (row: MonthData) => getAlertLevel(row) !== null;

export const ALERT_BORDER: Record<NonNullable<AlertLevel>, string> = {
    danger: "border-l-4 border-l-[#f43f5e]", // rojo — coincide con --chart-line
    warning: "border-l-4 border-l-[#f59e0b]", // amber — coincide con COLOR_CUSHION
    neutral: "border-l-4 border-l-badge-neutral-fg", // gris — funciona bien en ambos temas
};