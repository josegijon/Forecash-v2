import { useMemo } from "react";
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, AreaChart, ReferenceLine,
} from "recharts";

import { detectBalanceCrosses } from "@core";
import type { MonthData } from "../../utils/projectionTypes";
import { useActiveScenario, useCurrencySymbol } from "@/store";

import { COLOR_POSITIVE, COLOR_NEGATIVE, COLOR_CUSHION } from "./balanceChartColors";
import { useZeroOffset } from "./useZeroOffset";
import { useXAxisInterval } from "./useXAxisInterval";
import { CrossingDot } from "./CrossingDot";
import { BalanceTooltip } from "./BalanceTooltip";
import { LegendItem } from "./BalanceChartLegend";

interface BalanceAreaChartProps {
    data: MonthData[];
    selectedMonths: number;
}

const tickFormatter = (v: number) =>
    v >= 1000 || v <= -1000
        ? `${(v / 1000).toFixed(Math.abs(v) >= 10000 ? 0 : 1)}k`
        : `${v}`;

const euroFormatter = (v: number) => v.toLocaleString("es-ES");

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

    const capitalCrossSet = new Map(capitalCrosses.map((e) => [e.index, e.type]));
    const cushionCrossSet = new Map(cushionCrosses.map((e) => [e.index, e.type]));
    const riskCrossSet = new Map(riskCrosses.map((e) => [e.index, e.type]));

    const enrichedData = useMemo(
        () => data.map((d, i) => ({
            ...d,
            _crossCapital: capitalCrossSet.get(i),
            _crossCushion: cushionCrossSet.get(i),
            _crossRisk: riskCrossSet.get(i),
        })),
        [data, capitalCrosses, cushionCrosses, riskCrosses]
    );

    const zeroOffset = useZeroOffset(balances);
    const hasNegative = zeroOffset !== null;
    const xAxisInterval = useXAxisInterval(selectedMonths);

    const lineColor = hasNegative && (zeroOffset === 0 || zeroOffset! < 0.5)
        ? COLOR_NEGATIVE
        : COLOR_POSITIVE;

    const zeroOffsetPct = zeroOffset !== null ? `${(zeroOffset * 100).toFixed(1)}%` : "0%";

    const activeRefs: { value: number; color: string; label: string }[] = [];
    if (cushionBalance > 0)
        activeRefs.push({ value: cushionBalance, color: COLOR_CUSHION, label: `Colchón: ${euroFormatter(cushionBalance)}${currencySymbol}` });
    if (capitalGoal > 0)
        activeRefs.push({ value: capitalGoal, color: COLOR_POSITIVE, label: `Objetivo: ${euroFormatter(capitalGoal)}${currencySymbol}` });

    return (
        <>
            <div className="flex items-center justify-between gap-3 mb-5">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    Balance acumulado
                </h3>
                <div className="flex gap-4 flex-wrap justify-end">
                    <LegendItem color={COLOR_POSITIVE} label="Balance positivo" />
                    {hasNegative && <LegendItem color={COLOR_NEGATIVE} label="Balance negativo" />}
                    {hasNegative && <LegendItem color={COLOR_NEGATIVE} label="Zona de riesgo" dashed />}
                    {cushionBalance > 0 && <LegendItem color={COLOR_CUSHION} label="Colchón" dashed />}
                    {capitalGoal > 0 && <LegendItem color={COLOR_POSITIVE} label="Objetivo de capital" dashed />}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={enrichedData} margin={{ top: 16, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradBalanceLine" x1="0" y1="0" x2="0" y2="1">
                            {zeroOffset === null ? (
                                <>
                                    <stop offset="0%" stopColor={COLOR_POSITIVE} />
                                    <stop offset="100%" stopColor={COLOR_POSITIVE} />
                                </>
                            ) : zeroOffset === 0 ? (
                                <>
                                    <stop offset="0%" stopColor={COLOR_NEGATIVE} />
                                    <stop offset="100%" stopColor={COLOR_NEGATIVE} />
                                </>
                            ) : (
                                <>
                                    <stop offset="0%" stopColor={COLOR_POSITIVE} />
                                    <stop offset={zeroOffsetPct} stopColor={COLOR_POSITIVE} />
                                    <stop offset={zeroOffsetPct} stopColor={COLOR_NEGATIVE} />
                                    <stop offset="100%" stopColor={COLOR_NEGATIVE} />
                                </>
                            )}
                        </linearGradient>

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
                        axisLine={false} tickLine={false}
                        interval={xAxisInterval}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false} tickLine={false}
                        tickFormatter={tickFormatter}
                    />

                    <Tooltip content={<BalanceTooltip />} />

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
                        dot={(dotProps: any) => {
                            const p = dotProps.payload;
                            if (p?._crossCapital || p?._crossCushion || p?._crossRisk) {
                                return <CrossingDot key={dotProps.index} {...dotProps} />;
                            }
                            return <g key={dotProps.index} />;
                        }}
                        activeDot={{ r: 5, fill: lineColor, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
};