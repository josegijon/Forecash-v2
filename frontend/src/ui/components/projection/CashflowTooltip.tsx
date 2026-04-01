import type { MonthData } from "../../utils/projectionTypes";
import { useCurrencySymbol } from "@/store";

interface CashflowTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: MonthData }>;
    label?: string;
}

export const CashflowTooltip = ({ active, payload, label }: CashflowTooltipProps) => {
    const currencySymbol = useCurrencySymbol();

    if (!active || !payload?.length) return null;

    const ingresos = payload.find((p) => p.name === "ingresos")?.value ?? 0;
    const gastos = payload.find((p) => p.name === "gastos")?.value ?? 0;
    const neto = ingresos - gastos;
    const isPositive = neto >= 0;

    const fmt = (v: number) => `${v.toLocaleString("es-ES")} ${currencySymbol}`;

    return (
        <div style={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            padding: "12px 14px",
            fontSize: "13px",
            minWidth: "180px",
        }}>
            <p style={{ fontWeight: 700, color: "hsl(var(--foreground))", marginBottom: 8 }}>
                {label}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span style={{ color: "hsl(var(--muted-foreground))" }}>Ingresos</span>
                    <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{fmt(ingresos)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span style={{ color: "hsl(var(--muted-foreground))" }}>Gastos</span>
                    <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{fmt(gastos)}</span>
                </div>
                <div style={{
                    display: "flex", justifyContent: "space-between", gap: 16,
                    marginTop: 6, paddingTop: 6,
                    borderTop: "1px solid hsl(var(--border))",
                }}>
                    <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>Neto</span>
                    <span style={{
                        fontWeight: 700,
                        color: isPositive ? "hsl(var(--primary))" : "hsl(var(--chart-line))",
                    }}>
                        {isPositive ? "+" : ""}{fmt(neto)}
                    </span>
                </div>
            </div>
        </div>
    );
};