import { useEffect, useState } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

import { type DataPoint } from "./types";
import { useCurrencySymbol } from "@/store";

interface SimulationChartProps {
    data: DataPoint[];
    scenarioName: string;
    selectedMonths: number;
}

const useXAxisInterval = (selectedMonths: number): number => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handler = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    const isMobile = width < 640;

    if (!isMobile) {
        // Desktop: comportamiento original
        if (selectedMonths <= 12) return 0;
        if (selectedMonths <= 24) return 2;
        return 5;
    }

    // Mobile: mostrar menos etiquetas
    if (selectedMonths <= 6) return 0;
    if (selectedMonths <= 12) return 1;
    if (selectedMonths <= 24) return 3;
    return 11; // ~5 años → una etiqueta cada 12 meses
}

export const SimulationChart = ({ data, scenarioName, selectedMonths }: SimulationChartProps) => {
    const currencySymbol = useCurrencySymbol();
    const xAxisInterval = useXAxisInterval(selectedMonths);

    return (
        <>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
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
        </>
    );
};