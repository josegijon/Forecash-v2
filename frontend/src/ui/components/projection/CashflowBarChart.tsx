import { BarChart3 } from "lucide-react";
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Bar, BarChart, type BarProps,
} from "recharts";
import type { MonthData } from "./projectionTypes";

interface CashflowBarChartProps {
    data: MonthData[];
    selectedMonths: number;
}

const COLOR_INCOME = "#6366f1";         // indigo
const COLOR_EXPENSE_NORMAL = "#94a3b8"; // slate
const COLOR_EXPENSE_PEAK = "#f43f5e";   // rose

const tickFormatter = (v: number) => `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;

const tooltipContentStyle = {
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontSize: "13px",
};

// Custom shape para gastos: colorea según isPeakExpense sin usar Cell (deprecated)
const GastosBar = (props: BarProps) => {
    const { x, y, width, height, payload } = props as BarProps & { payload: MonthData };
    if (!height || height <= 0) return null;
    const fill = payload?.isPeakExpense ? COLOR_EXPENSE_PEAK : COLOR_EXPENSE_NORMAL;
    const nx = Number(x), ny = Number(y), nw = Number(width), nh = Number(height), r = 4;
    return (
        <path
            d={`M${nx},${ny + nh} L${nx},${ny + r} Q${nx},${ny} ${nx + r},${ny} L${nx + nw - r},${ny} Q${nx + nw},${ny} ${nx + nw},${ny + r} L${nx + nw},${ny + nh} Z`}
            fill={fill}
        />
    );
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
                <Bar
                    dataKey="ingresos"
                    fill={COLOR_INCOME}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={selectedMonths <= 12 ? 24 : 14}
                    name="ingresos"
                />
                <Bar
                    dataKey="gastos"
                    shape={<GastosBar />}
                    maxBarSize={selectedMonths <= 12 ? 24 : 14}
                    name="gastos"
                />
            </BarChart>
        </ResponsiveContainer>

        {/* Leyenda manual — más fiable que Legend de Recharts con shapes personalizados */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLOR_INCOME }} />
                Ingresos
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLOR_EXPENSE_NORMAL }} />
                Gasto normal
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLOR_EXPENSE_PEAK }} />
                Pico de gasto (&gt;130% media)
            </div>
        </div>
    </div>
);