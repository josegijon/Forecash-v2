import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

import { type DataPoint } from "./types";
import { SimulationTooltip, type SimulationTooltipProps } from "./SimulationTooltip";
import { useXAxisInterval } from "@/ui/hooks/useXAxisInterval";

interface SimulationChartProps {
    data: DataPoint[];
    scenarioName: string;
    selectedMonths: number;
}

const COLOR_ACTUAL = "#15803D";
const COLOR_COMPARADO = "#22C55E";
const LABEL_ACTUAL = "Escenario Actual";

// ─── LegendItem ───────────────────────────────────────────────────────────────

interface LegendItemProps {
    color: string;
    label: string;
    dashed?: boolean;
}

const LegendItem = ({ color, label, dashed }: LegendItemProps) => (
    <div className="flex items-center gap-2">
        {dashed ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <line x1="0" y1="6" x2="5" y2="6" stroke={color} strokeWidth="2" />
                <line x1="7" y1="6" x2="12" y2="6" stroke={color} strokeWidth="2" />
            </svg>
        ) : (
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
        )}
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
);

// ─── SimulationChart ──────────────────────────────────────────────────────────

export const SimulationChart = ({ data, scenarioName, selectedMonths }: SimulationChartProps) => {
    const xAxisInterval = useXAxisInterval(selectedMonths);

    if (!data || data.length < 2) {
        return (
            <div className="flex items-center justify-center h-95 text-sm text-muted-foreground">
                Sin datos suficientes para mostrar la proyección
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between gap-3 mb-6">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    Trayectoria comparativa
                </h3>
                <div className="flex gap-4 flex-wrap justify-end">
                    <LegendItem color={COLOR_ACTUAL} label={LABEL_ACTUAL} />
                    <LegendItem color={COLOR_COMPARADO} label={scenarioName} dashed />
                </div>
            </div>

            <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLOR_ACTUAL} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={COLOR_ACTUAL} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradComparado" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLOR_COMPARADO} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={COLOR_COMPARADO} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        interval={xAxisInterval}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`}
                    />
                    <Tooltip
                        content={(props: { active?: boolean; payload?: unknown; label?: unknown }) => (
                            <SimulationTooltip
                                active={props.active}
                                payload={props.payload as SimulationTooltipProps["payload"]}
                                label={props.label as string | undefined}
                                scenarioName={scenarioName}
                            />
                        )}
                        cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />
                    <Area type="monotone" dataKey="actual" stroke={COLOR_ACTUAL} strokeWidth={2.5} fill="url(#gradActual)" dot={false} activeDot={{ r: 5, fill: COLOR_ACTUAL, strokeWidth: 2, stroke: "hsl(var(--background))" }} />
                    <Area type="monotone" dataKey="comparado" stroke={COLOR_COMPARADO} strokeWidth={2} strokeDasharray="6 3" fill="url(#gradComparado)" dot={false} activeDot={{ r: 5, fill: COLOR_COMPARADO, strokeWidth: 2, stroke: "hsl(var(--background))" }} />
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
};