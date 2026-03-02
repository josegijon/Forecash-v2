import { GitCompareArrows } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

interface DataPoint {
    month: string;
    actual: number;
    comparado: number;
    diferencia: number;
}

interface Props {
    data: DataPoint[];
    scenarioName: string;
    selectedMonths: number;
}

export const SimulationChart = ({ data, scenarioName, selectedMonths }: Props) => (
    <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
            <GitCompareArrows size={20} className="text-primary" />
            <h3 className="font-bold text-slate-900">Trayectoria comparativa</h3>
        </div>

        <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradComparado" x1="0" y1="0" x2="0" y2="1">
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
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`}
                />
                <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "13px" }}
                    formatter={(value, name) => [
                        `${Number(value).toLocaleString("es-ES")} €`,
                        name === "actual" ? "Escenario Actual" : scenarioName,
                    ]}
                    labelStyle={{ fontWeight: 600, color: "#1e293b" }}
                />
                <Legend
                    formatter={(value: string) => value === "actual" ? "Escenario Actual" : scenarioName}
                    wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
                />
                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradActual)" dot={false} activeDot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} />
                <Area type="monotone" dataKey="comparado" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradComparado)" dot={false} activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);