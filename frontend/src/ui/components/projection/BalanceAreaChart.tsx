import { useMemo, type ReactNode } from "react";
import { Target, Shield, TrendingUp, TrendingDown } from "lucide-react";
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

// ─── Formatters ───────────────────────────────────────────────────────────────

const tickFormatter = (v: number) =>
    v >= 1000 || v <= -1000
        ? `${(v / 1000).toFixed(Math.abs(v) >= 10000 ? 0 : 1)}k`
        : `${v}`;

const euroFormatter = (v: number) => `${v.toLocaleString("es-ES")}`;

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
                <circle cx={cx} cy={cy} r={18} fill="#10b981" fillOpacity={0.12} />
                <circle cx={cx} cy={cy} r={11} fill="#10b981" fillOpacity={0.22} />
                <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="#fff" strokeWidth={2.5} />
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
                <circle cx={cx} cy={cy} r={14} fill="#ef4444" fillOpacity={0.15} />
                <circle cx={cx} cy={cy} r={8} fill="#ef4444" fillOpacity={0.22} />
                <circle cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#fff" strokeWidth={2.5} />
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
                <circle cx={cx} cy={cy} r={14} fill="#ef4444" fillOpacity={0.12} />
                <circle cx={cx} cy={cy} r={8} fill="#ef4444" fillOpacity={0.20} />
                <circle cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#fff" strokeWidth={2} />
                <path d={`M${cx - 2.5} ${cy - 4} L${cx + 2.5} ${cy - 4} L${cx} ${cy + 3} Z`} fill="#fff" />
            </g>
        );
    }

    if (payload._crossRisk === "gained") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill="#22c55e" fillOpacity={0.12} />
                <circle cx={cx} cy={cy} r={8} fill="#22c55e" fillOpacity={0.20} />
                <circle cx={cx} cy={cy} r={5} fill="#22c55e" stroke="#fff" strokeWidth={2} />
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

    return (
        <div style={{
            borderRadius: "14px", border: "1px solid #e2e8f0",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)", background: "#fff",
            padding: "14px 16px", fontSize: "13px", minWidth: "180px",
        }}>
            <p style={{ fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>{label}</p>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: isNeg ? "#ef4444" : "#6366f1",
                    display: "inline-block", flexShrink: 0,
                }} />
                <span style={{ color: "#64748b" }}>Balance:</span>
                <span style={{ fontWeight: 700, color: isNeg ? "#ef4444" : "#1e293b", marginLeft: "auto" }}>
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
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
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
        // Los Maps se recrean cuando sus cruces cambian — incluirlos como deps
        // sería inestable; usamos los arrays originales como fuente de verdad
        [data, capitalCrosses, cushionCrosses, riskCrosses]
    );

    const hasNegative = data.some((d) => d.isNegativeBalance);
    const lineColor = hasNegative ? "#ef4444" : "#6366f1";

    const activeRefs: { value: number; color: string; label: string }[] = [];
    if (cushionBalance > 0)
        activeRefs.push({ value: cushionBalance, color: "#f59e0b", label: `Colchón: ${euroFormatter(cushionBalance)}${currencySymbol}` });
    if (capitalGoal > 0)
        activeRefs.push({ value: capitalGoal, color: "#10b981", label: `Objetivo: ${euroFormatter(capitalGoal)}${currencySymbol}` });

    // Pre-computed antes del return para evitar IIFE en JSX
    const capitalEntry = lastCapitalCross ? enrichedData[lastCapitalCross.index] : null;
    const cushionEntry = lastCushionCross ? enrichedData[lastCushionCross.index] : null;
    const riskEntry = showRiskBadge && lastRiskCross ? enrichedData[lastRiskCross.index] : null;
    const hasMilestones = !!(capitalEntry || cushionEntry || riskEntry);

    return (
        <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    <h3 className="font-bold text-slate-900">Balance acumulado</h3>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <LegendItem color="#6366f1" label="Balance" />
                    {cushionBalance > 0 && <LegendItem color="#f59e0b" label="Colchón" dashed />}
                    {capitalGoal > 0 && <LegendItem color="#10b981" label="Objetivo de capital" dashed />}
                    <LegendItem color="#ef4444" label="Zona de riesgo" dashed />
                </div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={enrichedData} margin={{ top: 16, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={lineColor} stopOpacity={hasNegative ? 0.15 : 0.22} />
                            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={false}
                        interval={selectedMonths <= 12 ? 0 : selectedMonths <= 24 ? 2 : 5}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={tickFormatter}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <ReferenceLine
                        y={0}
                        stroke="#ef4444"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        label={{ value: "Zona de riesgo", position: "insideTopLeft", fill: "#ef4444", fontSize: 11, fontWeight: 600 }}
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
                        stroke={lineColor}
                        strokeWidth={2.5}
                        fill="url(#gradBalance)"
                        // Solo renderiza el dot en puntos de cruce; el resto se omite
                        dot={(dotProps: DotProps & { payload?: EnrichedMonthData; index?: number }) => {
                            const p = dotProps.payload;
                            if (p?._crossCapital || p?._crossCushion || p?._crossRisk) {
                                return <CrossingDot key={dotProps.index} {...dotProps} />;
                            }
                            return <g key={dotProps.index} />;
                        }}
                        activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {hasMilestones && (
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex gap-2.5 flex-wrap">
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
        </div>
    );
};