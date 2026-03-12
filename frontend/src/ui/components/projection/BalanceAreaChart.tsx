import { useMemo, type ReactNode } from "react";
import { Target, Shield, TrendingDown } from "lucide-react";
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, AreaChart, ReferenceLine,
} from "recharts";
import type { DotProps } from "recharts";

import { detectBalanceCrosses } from "@core";
import type { CrossType } from "@core";

import type { MonthData } from "./projectionTypes";
import { useActiveScenario, useCurrencySymbol } from "@/store";

interface BalanceAreaChartProps {
    data: MonthData[];
    selectedMonths: number;
}

// ─── Colores ──────────────────────────────────────────────────────────────────

const COLOR_POSITIVE = "#15803D"; // verde — coincide con --primary de la app
const COLOR_NEGATIVE = "#f43f5e"; // rojo — coincide con --chart-line de la app

// ─── Formatters ───────────────────────────────────────────────────────────────

const tickFormatter = (v: number) =>
    v >= 1000 || v <= -1000
        ? `${(v / 1000).toFixed(Math.abs(v) >= 10000 ? 0 : 1)}k`
        : `${v}`;

const euroFormatter = (v: number) => `${v.toLocaleString("es-ES")}`;

// ─── Hook: calcula el offset del cero para el gradiente split ─────────────────
//
// Recharts dibuja el gradiente de arriba (0%) hacia abajo (100%).
// Si el rango va de `max` a `min`, el cero está en:
//   offset = (max - 0) / (max - min)  → expresado en tanto por uno
//
// Con ese offset ponemos verde arriba del cero y rojo debajo.

function useZeroOffset(balances: number[]) {
    return useMemo(() => {
        if (balances.length === 0) return null;
        const max = Math.max(...balances);
        const min = Math.min(...balances);
        if (min >= 0) return null;   // todo positivo → no hay zona roja
        if (max <= 0) return 0;      // todo negativo → todo rojo (offset = 0%)
        const range = max - min;
        return max / range;          // fracción [0,1] donde cae el cero
    }, [balances]);
}

// ─── CrossingDot ──────────────────────────────────────────────────────────────

interface CrossingDotProps {
    cx?: number;
    cy?: number;
    index?: number;
    payload?: MonthData & { _crossCapital?: CrossType; _crossCushion?: CrossType; _crossRisk?: CrossType };
}

const CrossingDot = (props: CrossingDotProps) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;

    if (payload._crossCapital === "gained") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={18} fill={COLOR_POSITIVE} fillOpacity={0.12} />
                <circle cx={cx} cy={cy} r={11} fill={COLOR_POSITIVE} fillOpacity={0.22} />
                <circle cx={cx} cy={cy} r={6} fill={COLOR_POSITIVE} stroke="#fff" strokeWidth={2.5} />
                <path
                    d={`M${cx - 3} ${cy} l2 2.5 l4.5 -4.5`}
                    stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none"
                />
            </g>
        );
    }

    if (payload._crossCapital === "lost") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill={COLOR_NEGATIVE} fillOpacity={0.15} />
                <circle cx={cx} cy={cy} r={8} fill={COLOR_NEGATIVE} fillOpacity={0.22} />
                <circle cx={cx} cy={cy} r={5} fill={COLOR_NEGATIVE} stroke="#fff" strokeWidth={2.5} />
                <path
                    d={`M${cx - 3} ${cy - 3} l6 6 M${cx + 3} ${cy - 3} l-6 6`}
                    stroke="#fff" strokeWidth={1.8} strokeLinecap="round" fill="none"
                />
            </g>
        );
    }

    if (payload._crossCushion === "gained") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill="#f59e0b" fillOpacity={0.15} />
                <circle cx={cx} cy={cy} r={8} fill="#f59e0b" fillOpacity={0.25} />
                <circle cx={cx} cy={cy} r={5} fill="#f59e0b" stroke="#fff" strokeWidth={2} />
            </g>
        );
    }

    if (payload._crossCushion === "lost") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill="#f97316" fillOpacity={0.15} />
                <circle cx={cx} cy={cy} r={8} fill="#f97316" fillOpacity={0.22} />
                <circle cx={cx} cy={cy} r={5} fill="#f97316" stroke="#fff" strokeWidth={2} />
            </g>
        );
    }

    if (payload._crossRisk === "lost") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill={COLOR_NEGATIVE} fillOpacity={0.12} />
                <circle cx={cx} cy={cy} r={8} fill={COLOR_NEGATIVE} fillOpacity={0.20} />
                <circle cx={cx} cy={cy} r={5} fill={COLOR_NEGATIVE} stroke="#fff" strokeWidth={2} />
                <path d={`M${cx - 2.5} ${cy - 4} L${cx + 2.5} ${cy - 4} L${cx} ${cy + 3} Z`} fill="#fff" />
            </g>
        );
    }

    if (payload._crossRisk === "gained") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill={COLOR_POSITIVE} fillOpacity={0.12} />
                <circle cx={cx} cy={cy} r={8} fill={COLOR_POSITIVE} fillOpacity={0.20} />
                <circle cx={cx} cy={cy} r={5} fill={COLOR_POSITIVE} stroke="#fff" strokeWidth={2} />
                <path d={`M${cx - 2.5} ${cy + 4} L${cx + 2.5} ${cy + 4} L${cx} ${cy - 3} Z`} fill="#fff" />
            </g>
        );
    }

    return null;
};

// ─── CustomTooltip ────────────────────────────────────────────────────────────

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

interface CustomTooltipProps {
    active?: boolean;
    payload?: RechartsTooltipEntry[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    const currencySymbol = useCurrencySymbol();

    if (!active || !payload?.length) return null;

    const d = payload[0].payload;
    const { balance, isNegativeBalance: isNeg, _crossCapital: crossCapital, _crossCushion: crossCushion } = d;
    const dotColor = isNeg ? COLOR_NEGATIVE : COLOR_POSITIVE;

    return (
        <div style={{
            borderRadius: "14px", border: "1px solid hsl(var(--border))",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)", background: "hsl(var(--card))",
            padding: "14px 16px", fontSize: "13px", minWidth: "180px",
        }}>
            <p style={{ fontWeight: 700, color: "hsl(var(--card-foreground))", marginBottom: 6 }}>{label}</p>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: dotColor,
                    display: "inline-block", flexShrink: 0,
                }} />
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Balance:</span>
                <span style={{ fontWeight: 700, color: isNeg ? COLOR_NEGATIVE : "hsl(var(--card-foreground))", marginLeft: "auto" }}>
                    {euroFormatter(balance)}{currencySymbol}
                </span>
            </div>

            {crossCapital === "gained" && (
                <div style={{ marginTop: 10, padding: "7px 10px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 6, color: "#15803d", fontWeight: 600, fontSize: 12 }}>
                    <Target size={13} />¡Objetivo de capital alcanzado!
                </div>
            )}
            {crossCapital === "lost" && (
                <div style={{ marginTop: 10, padding: "7px 10px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca", display: "flex", alignItems: "center", gap: 6, color: "#dc2626", fontWeight: 600, fontSize: 12 }}>
                    <Target size={13} />Objetivo de capital perdido
                </div>
            )}
            {crossCushion === "gained" && (
                <div style={{ marginTop: 10, padding: "7px 10px", background: "#fffbeb", borderRadius: 8, border: "1px solid #fde68a", display: "flex", alignItems: "center", gap: 6, color: "#92400e", fontWeight: 600, fontSize: 12 }}>
                    <Shield size={13} />Colchón alcanzado
                </div>
            )}
            {crossCushion === "lost" && (
                <div style={{ marginTop: 10, padding: "7px 10px", background: "#fff7ed", borderRadius: 8, border: "1px solid #fed7aa", display: "flex", alignItems: "center", gap: 6, color: "#c2410c", fontWeight: 600, fontSize: 12 }}>
                    <Shield size={13} />Colchón perdido
                </div>
            )}
            {isNeg && (
                <div style={{ marginTop: 10, padding: "7px 10px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca", color: "#dc2626", fontWeight: 600, fontSize: 12 }}>
                    ⚠ Balance negativo
                </div>
            )}
        </div>
    );
};

// ─── LegendItem ───────────────────────────────────────────────────────────────

interface LegendItemProps {
    color: string;
    label: string;
    dashed?: boolean;
}

const LegendItem = ({ color, label, dashed }: LegendItemProps) => (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <svg width="22" height="10">
            <line x1="0" y1="5" x2="22" y2="5" stroke={color} strokeWidth="2" strokeDasharray={dashed ? "5 3" : undefined} />
        </svg>
        {label}
    </div>
);

// ─── MilestoneBadge ───────────────────────────────────────────────────────────

interface MilestoneBadgeProps {
    icon: ReactNode;
    label: string;
    className: string;
}

const MilestoneBadge = ({ icon, label, className }: MilestoneBadgeProps) => (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${className}`}>
        {icon}
        {label}
    </div>
);

// ─── BalanceAreaChart ─────────────────────────────────────────────────────────

export const BalanceAreaChart = ({ data, selectedMonths }: BalanceAreaChartProps) => {
    const activeScenario = useActiveScenario();
    const currencySymbol = useCurrencySymbol();

    const cushionBalance = activeScenario?.cushionBalance ?? 0;
    const capitalGoal = activeScenario?.capitalGoal ?? 0;

    const balances = useMemo(() => data.map((d) => d.balance), [data]);

    const capitalCrosses = useMemo(
        () => detectBalanceCrosses({ balances, threshold: capitalGoal }),
        [balances, capitalGoal]
    );
    const cushionCrosses = useMemo(
        () => detectBalanceCrosses({ balances, threshold: cushionBalance }),
        [balances, cushionBalance]
    );
    const riskCrosses = useMemo(
        () => detectBalanceCrosses({ balances, threshold: 0 }),
        [balances]
    );

    const lastCapitalCross = capitalCrosses.at(-1) ?? null;
    const lastCushionCross = cushionCrosses.at(-1) ?? null;
    const lastRiskCross = riskCrosses.at(-1) ?? null;
    const showRiskBadge = lastRiskCross?.type === "lost";

    const capitalCrossSet = new Map(capitalCrosses.map((e) => [e.index, e.type]));
    const cushionCrossSet = new Map(cushionCrosses.map((e) => [e.index, e.type]));
    const riskCrossSet = new Map(riskCrosses.map((e) => [e.index, e.type]));

    const enrichedData = useMemo(
        () =>
            data.map((d, i) => ({
                ...d,
                _crossCapital: capitalCrossSet.get(i),
                _crossCushion: cushionCrossSet.get(i),
                _crossRisk: riskCrossSet.get(i),
            })),
        [data, capitalCrosses, cushionCrosses, riskCrosses]
    );

    // ── Gradiente split por cero ──────────────────────────────────────────────
    //
    // zeroOffset = null  → todo positivo (solo verde)
    // zeroOffset = 0     → todo negativo (solo rojo)
    // zeroOffset = 0..1  → split: verde arriba, rojo abajo

    const zeroOffset = useZeroOffset(balances);
    const hasNegative = zeroOffset !== null;

    // La línea y el activeDot usan el color del estado mayoritario
    const lineColor = hasNegative && (zeroOffset === 0 || zeroOffset! < 0.5)
        ? COLOR_NEGATIVE
        : COLOR_POSITIVE;

    const activeRefs: { value: number; color: string; label: string }[] = [];
    if (cushionBalance > 0)
        activeRefs.push({ value: cushionBalance, color: "#f59e0b", label: `Colchón: ${euroFormatter(cushionBalance)}${currencySymbol}` });
    if (capitalGoal > 0)
        activeRefs.push({ value: capitalGoal, color: "#10b981", label: `Objetivo: ${euroFormatter(capitalGoal)}${currencySymbol}` });

    const capitalEntry = lastCapitalCross ? enrichedData[lastCapitalCross.index] : null;
    const cushionEntry = lastCushionCross ? enrichedData[lastCushionCross.index] : null;
    const riskEntry = showRiskBadge && lastRiskCross ? enrichedData[lastRiskCross.index] : null;
    const hasMilestones = !!(capitalEntry || cushionEntry || riskEntry);

    // Porcentajes para el gradiente SVG (Recharts los acepta como string "X%")
    const zeroOffsetPct = zeroOffset !== null ? `${(zeroOffset * 100).toFixed(1)}%` : "0%";

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 mb-6">
                    <h3 className="text-lg font-medium leading-none tracking-tight">
                        Balance acumulado
                    </h3>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <LegendItem color={COLOR_POSITIVE} label="Balance positivo" />
                    {hasNegative && <LegendItem color={COLOR_NEGATIVE} label="Balance negativo" />}
                    {cushionBalance > 0 && <LegendItem color="#f59e0b" label="Colchón" dashed />}
                    {capitalGoal > 0 && <LegendItem color="#10b981" label="Objetivo de capital" dashed />}
                    <LegendItem color={COLOR_NEGATIVE} label="Zona de riesgo" dashed />
                </div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={enrichedData} margin={{ top: 16, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        {/* Gradiente de línea: split exacto en el cero */}
                        <linearGradient id="gradBalanceLine" x1="0" y1="0" x2="0" y2="1">
                            {zeroOffset === null ? (
                                // Todo positivo — solo verde
                                <>
                                    <stop offset="0%" stopColor={COLOR_POSITIVE} />
                                    <stop offset="100%" stopColor={COLOR_POSITIVE} />
                                </>
                            ) : zeroOffset === 0 ? (
                                // Todo negativo — solo rojo
                                <>
                                    <stop offset="0%" stopColor={COLOR_NEGATIVE} />
                                    <stop offset="100%" stopColor={COLOR_NEGATIVE} />
                                </>
                            ) : (
                                // Split: verde hasta el cero, rojo desde el cero
                                <>
                                    <stop offset="0%" stopColor={COLOR_POSITIVE} />
                                    <stop offset={zeroOffsetPct} stopColor={COLOR_POSITIVE} />
                                    <stop offset={zeroOffsetPct} stopColor={COLOR_NEGATIVE} />
                                    <stop offset="100%" stopColor={COLOR_NEGATIVE} />
                                </>
                            )}
                        </linearGradient>

                        {/* Gradiente de área: mismo split pero con opacidad */}
                        <linearGradient id="gradBalanceFill" x1="0" y1="0" x2="0" y2="1">
                            {zeroOffset === null ? (
                                <>
                                    <stop offset="0%" stopColor={COLOR_POSITIVE} stopOpacity={0.22} />
                                    <stop offset="100%" stopColor={COLOR_POSITIVE} stopOpacity={0} />
                                </>
                            ) : zeroOffset === 0 ? (
                                <>
                                    <stop offset="0%" stopColor={COLOR_NEGATIVE} stopOpacity={0.18} />
                                    <stop offset="100%" stopColor={COLOR_NEGATIVE} stopOpacity={0} />
                                </>
                            ) : (
                                <>
                                    <stop offset="0%" stopColor={COLOR_POSITIVE} stopOpacity={0.22} />
                                    <stop offset={zeroOffsetPct} stopColor={COLOR_POSITIVE} stopOpacity={0.08} />
                                    <stop offset={zeroOffsetPct} stopColor={COLOR_NEGATIVE} stopOpacity={0.10} />
                                    <stop offset="100%" stopColor={COLOR_NEGATIVE} stopOpacity={0.22} />
                                </>
                            )}
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        interval={selectedMonths <= 12 ? 0 : selectedMonths <= 24 ? 2 : 5}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={tickFormatter}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <ReferenceLine
                        y={0}
                        stroke={COLOR_NEGATIVE}
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        label={{ value: "Zona de riesgo", position: "insideTopLeft", fill: COLOR_NEGATIVE, fontSize: 11, fontWeight: 600 }}
                    />

                    {activeRefs.map(({ value, color, label }) => (
                        <ReferenceLine
                            key={label}
                            y={value}
                            stroke={color}
                            strokeDasharray="6 3"
                            strokeWidth={1.5}
                            label={{ value: label, position: "insideTopRight", fill: color, fontSize: 11, fontWeight: 600 }}
                        />
                    ))}

                    <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="url(#gradBalanceLine)"
                        strokeWidth={2.5}
                        fill="url(#gradBalanceFill)"
                        dot={(dotProps: DotProps & { payload?: EnrichedMonthData; index?: number }) => {
                            const p = dotProps.payload;
                            if (p?._crossCapital || p?._crossCushion || p?._crossRisk) {
                                return <CrossingDot key={dotProps.index} {...dotProps} />;
                            }
                            return <g key={dotProps.index} />;
                        }}
                        activeDot={{ r: 5, fill: lineColor, strokeWidth: 2, stroke: "#fff" }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {hasMilestones && (
                <div className="mt-4 pt-3.5 border-t border-border flex gap-2.5 flex-wrap">
                    {capitalEntry && lastCapitalCross?.type === "gained" && (
                        <MilestoneBadge
                            icon={<Target size={13} />}
                            label={`Objetivo de capital alcanzado en ${capitalEntry.month}`}
                            className="bg-emerald-50 border-emerald-200 text-emerald-700"
                        />
                    )}
                    {capitalEntry && lastCapitalCross?.type === "lost" && (
                        <MilestoneBadge
                            icon={<Target size={13} />}
                            label={`Objetivo de capital perdido en ${capitalEntry.month}`}
                            className="bg-red-50 border-red-200 text-red-600"
                        />
                    )}
                    {cushionEntry && lastCushionCross?.type === "gained" && (
                        <MilestoneBadge
                            icon={<Shield size={13} />}
                            label={`Colchón alcanzado en ${cushionEntry.month}`}
                            className="bg-amber-50 border-amber-200 text-amber-800"
                        />
                    )}
                    {cushionEntry && lastCushionCross?.type === "lost" && (
                        <MilestoneBadge
                            icon={<Shield size={13} />}
                            label={`Colchón perdido en ${cushionEntry.month}`}
                            className="bg-orange-50 border-orange-200 text-orange-700"
                        />
                    )}
                    {riskEntry && (
                        <MilestoneBadge
                            icon={<TrendingDown size={13} />}
                            label={`En negativo desde ${riskEntry.month}`}
                            className="bg-red-50 border-red-200 text-red-600"
                        />
                    )}
                </div>
            )}
        </>
    );
};