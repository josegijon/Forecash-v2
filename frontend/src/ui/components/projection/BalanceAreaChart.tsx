import { Activity } from "lucide-react";
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, AreaChart, ReferenceLine,
} from "recharts";

import type { MonthData } from "./projectionTypes";
import { useActiveScenario } from "@/store";

interface BalanceAreaChartProps {
    data: MonthData[];
    selectedMonths: number;
}

const tickFormatter = (v: number) => `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;

const tooltipContentStyle = {
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontSize: "13px",
};

export const BalanceAreaChart = ({ data, selectedMonths }: BalanceAreaChartProps) => {
    const activeScenario = useActiveScenario();
    const cushionBalance = activeScenario?.cushionBalance ?? 0;

    return (
        <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Activity size={20} className="text-primary" />
                <h3 className="font-bold text-slate-900">Balance acumulado</h3>
            </div>

            <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
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
                    <Tooltip
                        contentStyle={tooltipContentStyle}
                        formatter={(value) => [
                            `${Number(value).toLocaleString("es-ES")} €`,
                            "Balance",
                        ]}
                        labelStyle={{ fontWeight: 600, color: "#1e293b" }}
                    />
                    <ReferenceLine
                        y={0}
                        stroke="#ef4444"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        label={{
                            value: "Zona de riesgo",
                            position: "insideTopLeft",
                            fill: "#ef4444",
                            fontSize: 11,
                            fontWeight: 600,
                        }}
                    />
                    {cushionBalance > 0 && (
                        <ReferenceLine
                            y={cushionBalance}
                            stroke="#f59e0b"
                            strokeDasharray="6 3"
                            strokeWidth={1.5}
                            label={{
                                value: `Colchón: ${cushionBalance.toLocaleString("es-ES")} €`,
                                position: "insideTopLeft",
                                fill: "#f59e0b",
                                fontSize: 11,
                                fontWeight: 600,
                            }}
                        />
                    )}
                    <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="url(#gradBalance)"
                        dot={false}
                        activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
};