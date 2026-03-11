import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

import { type DataPoint } from "./types";
import { useCurrencySymbol } from "@/store";

interface SimulationChartProps {
    data: DataPoint[];
    scenarioName: string;
    selectedMonths: number;
}

export const SimulationChart = ({ data, scenarioName, selectedMonths }: SimulationChartProps) => {
    const currencySymbol = useCurrencySymbol();

    return (
        <div className="">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    Trayectoria comparativa
                </h3>
            </div>

            <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#15803D" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#15803D" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradComparado" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22C55E" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
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
                        tickFormatter={(v: number) => `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px"
                        }}
                        formatter={(value, name) => [
                            `${Number(value).toLocaleString("es-ES")} ${currencySymbol}`,
                            name === "actual" ? "Escenario Actual" : scenarioName,
                        ]}
                        labelStyle={{ fontWeight: 600, color: "hsl(var(--card-foreground))" }}
                    />
                    <Legend
                        formatter={(value: string) => value === "actual" ? "Escenario Actual" : scenarioName}
                        wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
                    />
                    <Area type="monotone" dataKey="actual" stroke="#15803D" strokeWidth={2.5} fill="url(#gradActual)" dot={false} activeDot={{ r: 5, fill: "#15803D", strokeWidth: 2, stroke: "#fff" }} />
                    <Area type="monotone" dataKey="comparado" stroke="#22C55E" strokeWidth={2.5} fill="url(#gradComparado)" dot={false} activeDot={{ r: 5, fill: "#22C55E", strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};