import { useCurrencySymbol } from "@/store";

interface TooltipEntry {
    name: string;
    value: number;
    color: string;
}

export interface SimulationTooltipProps {
    active?: boolean;
    payload?: TooltipEntry[];
    label?: string;
    scenarioName: string;
}

const LABEL_ACTUAL = "Escenario Actual";

const fmt = (v: number) => v.toLocaleString("es-ES");

export const SimulationTooltip = ({ active, payload, label, scenarioName }: SimulationTooltipProps) => {
    const currencySymbol = useCurrencySymbol();

    if (!active || !payload?.length) return null;

    const actual = payload.find((p) => p.name === "actual");
    const comparado = payload.find((p) => p.name === "comparado");
    const diff = (comparado?.value ?? 0) - (actual?.value ?? 0);
    const isPositive = diff >= 0;

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

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {actual && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: actual.color, display: "inline-block", flexShrink: 0 }} />
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>{LABEL_ACTUAL}</span>
                        <span style={{ fontWeight: 700, color: "hsl(var(--foreground))", marginLeft: "auto" }}>
                            {fmt(actual.value)}{currencySymbol}
                        </span>
                    </div>
                )}

                {comparado && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: comparado.color, display: "inline-block", flexShrink: 0 }} />
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>{scenarioName}</span>
                        <span style={{ fontWeight: 700, color: "hsl(var(--foreground))", marginLeft: "auto" }}>
                            {fmt(comparado.value)}{currencySymbol}
                        </span>
                    </div>
                )}

                {actual && comparado && (
                    <div style={{
                        display: "flex", justifyContent: "space-between", gap: 16,
                        marginTop: 6, paddingTop: 6,
                        borderTop: "1px solid hsl(var(--border))",
                    }}>
                        <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>Diferencia</span>
                        <span style={{ fontWeight: 700, color: isPositive ? "hsl(var(--primary))" : "hsl(var(--chart-line))" }}>
                            {isPositive ? "+" : ""}{fmt(diff)}{currencySymbol}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};