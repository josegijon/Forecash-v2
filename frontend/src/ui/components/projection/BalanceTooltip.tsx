import { Target, Shield, AlertTriangle } from "lucide-react";
import type { CrossType } from "@core";
import type { MonthData } from "../../utils/projectionTypes";
import { useCurrencySymbol } from "@/store";
import { COLOR_POSITIVE, COLOR_NEGATIVE } from "./balanceChartColors";

type EnrichedMonthData = MonthData & {
    _crossCapital?: CrossType;
    _crossCushion?: CrossType;
    _crossRisk?: CrossType;
};

interface RechartsTooltipEntry {
    payload: EnrichedMonthData;
    value: number;
    name: string;
}

export interface BalanceTooltipProps {
    active?: boolean;
    payload?: RechartsTooltipEntry[];
    label?: string;
}

const COLOR_WARNING = "#d97706"; // amber-600 — legible en light y dark

const euroFormatter = (v: number) => v.toLocaleString("es-ES");

export const BalanceTooltip = ({ active, payload, label }: BalanceTooltipProps) => {
    const currencySymbol = useCurrencySymbol();

    if (!active || !payload?.length) return null;

    const d = payload[0].payload;
    const { balance, isNegativeBalance: isNeg, _crossCapital: crossCapital, _crossCushion: crossCushion } = d;
    const dotColor = isNeg ? COLOR_NEGATIVE : COLOR_POSITIVE;

    return (
        <div style={{
            borderRadius: "var(--radius)",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            background: "hsl(var(--card))",
            padding: "12px 14px",
            fontSize: "13px",
            minWidth: "180px",
        }}>
            <p style={{ fontWeight: 700, color: "hsl(var(--foreground))", marginBottom: 8 }}>
                {label}
            </p>

            {/* Balance */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: dotColor, display: "inline-block", flexShrink: 0,
                }} />
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Balance:</span>
                <span style={{ fontWeight: 700, color: isNeg ? COLOR_NEGATIVE : "hsl(var(--foreground))", marginLeft: "auto" }}>
                    {euroFormatter(balance)}{currencySymbol}
                </span>
            </div>

            {/* Eventos — líneas simples sin fondo */}
            {(crossCapital || crossCushion || isNeg) && (
                <div style={{
                    marginTop: 8, paddingTop: 8,
                    borderTop: "1px solid hsl(var(--border))",
                    display: "flex", flexDirection: "column", gap: 4,
                }}>
                    {crossCapital === "gained" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLOR_POSITIVE, fontWeight: 600, fontSize: 12 }}>
                            <Target size={12} />
                            <span>Objetivo de capital alcanzado</span>
                        </div>
                    )}
                    {crossCapital === "lost" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLOR_NEGATIVE, fontWeight: 600, fontSize: 12 }}>
                            <Target size={12} />
                            <span>Objetivo de capital perdido</span>
                        </div>
                    )}
                    {crossCushion === "gained" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLOR_WARNING, fontWeight: 600, fontSize: 12 }}>
                            <Shield size={12} />
                            <span>Colchón alcanzado</span>
                        </div>
                    )}
                    {crossCushion === "lost" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLOR_WARNING, fontWeight: 600, fontSize: 12 }}>
                            <Shield size={12} />
                            <span>Colchón perdido</span>
                        </div>
                    )}
                    {isNeg && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLOR_NEGATIVE, fontWeight: 600, fontSize: 12 }}>
                            <AlertTriangle size={12} />
                            <span>Balance negativo</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};