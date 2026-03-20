import type { ReactNode } from "react";
import { Target, Shield, AlertTriangle } from "lucide-react";
import type { CrossType } from "@core";
import type { MonthData } from "../../utils/projectionTypes";
import { useCurrencySymbol } from "@/store";
import { COLOR_NEGATIVE, COLOR_POSITIVE } from "./balanceChartColors";

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

// Colores resueltos para inline styles — evita "hsl(var(--x) / 0.3)" que no funciona en todos los navegadores
const TOOLTIP_BLOCKS = {
    success: {
        bg: "rgba(34, 197, 94, 0.08)",
        border: "rgba(34, 197, 94, 0.3)",
        color: "hsl(var(--success))",
    },
    danger: {
        bg: "hsl(var(--badge-danger-bg))",
        border: "hsl(var(--badge-danger-fg))",
        color: "hsl(var(--badge-danger-fg))",
    },
    warning: {
        bg: "hsl(var(--badge-warning-bg))",
        border: "hsl(var(--badge-warning-fg))",
        color: "hsl(var(--badge-warning-fg))",
    },
} as const;

const TooltipBlock = ({
    variant, icon, text,
}: { variant: keyof typeof TOOLTIP_BLOCKS; icon: ReactNode; text: string }) => {
    const { bg, border, color } = TOOLTIP_BLOCKS[variant];
    return (
        <div style={{
            marginTop: 8, padding: "6px 10px",
            background: bg, borderRadius: 8,
            border: `1px solid ${border}`,
            display: "flex", alignItems: "center", gap: 6,
            color, fontWeight: 600, fontSize: 12,
        }}>
            {icon}{text}
        </div>
    );
};

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
            padding: "12px 14px", fontSize: "13px", minWidth: "180px",
        }}>
            <p style={{ fontWeight: 700, color: "hsl(var(--foreground))", marginBottom: 8 }}>{label}</p>

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

            {crossCapital === "gained" && <TooltipBlock variant="success" icon={<Target size={12} />} text="¡Objetivo de capital alcanzado!" />}
            {crossCapital === "lost" && <TooltipBlock variant="danger" icon={<Target size={12} />} text="Objetivo de capital perdido" />}
            {crossCushion === "gained" && <TooltipBlock variant="warning" icon={<Shield size={12} />} text="Colchón alcanzado" />}
            {crossCushion === "lost" && <TooltipBlock variant="warning" icon={<Shield size={12} />} text="Colchón perdido" />}
            {isNeg && <TooltipBlock variant="danger" icon={<AlertTriangle size={12} />} text="Balance negativo" />}
        </div>
    );
};