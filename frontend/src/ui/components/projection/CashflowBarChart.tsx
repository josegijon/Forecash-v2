import { BarChart3 } from "lucide-react";
import {
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Bar, BarChart, Cell,
} from "recharts";
import type { MonthData } from "./projectionTypes";

interface CashflowBarChartProps {
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

export const CashflowBarChart = ({ data, selectedMonths }: CashflowBarChartProps) => (
    <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-primary" />
            <h3 className="font-bold text-slate-900">Cashflow mensual</h3>
        </div>

        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    formatter={(value, name) => [
                        `${Number(value).toLocaleString("es-ES")} €`,
                        name === "ingresos" ? "Ingresos" : "Gastos",
                    ]}
                    labelStyle={{ fontWeight: 600, color: "#1e293b" }}
                />
                <Legend
                    formatter={(value: string) => value === "ingresos" ? "Ingresos" : "Gastos"}
                    wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
                />
                <Bar
                    dataKey="ingresos"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={selectedMonths <= 12 ? 24 : 14}
                />
                <Bar
                    dataKey="gastos"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={selectedMonths <= 12 ? 24 : 14}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.isPeakExpense ? "#ef4444" : "#f59e0b"}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-sm bg-amber-500" />
                Gasto normal
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-sm bg-red-500" />
                Pico de gasto (&gt;130%)
            </div>
        </div>
    </div>
);