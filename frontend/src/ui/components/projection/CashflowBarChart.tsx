import {
    XAxis, YAxis, Tooltip,
    ResponsiveContainer, Bar, BarChart, type BarProps,
} from "recharts";
import type { MonthData } from "./projectionTypes";
import { useCurrencySymbol } from "@/store";

interface CashflowBarChartProps {
    data: MonthData[];
    selectedMonths: number;
}

const COLOR_INCOME = "#10b981";
const COLOR_EXPENSE_NORMAL = "#f43f5e";
const COLOR_EXPENSE_PEAK = "#b91c1c";

const tickFormatter = (v: number) => `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;

const tooltipContentStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "12px"
};

// Custom shape: colorea según isPeakExpense sin usar Cell (deprecated)
const ExpenseBar = (props: BarProps) => {
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

export const CashflowBarChart = ({ data, selectedMonths }: CashflowBarChartProps) => {
    const currencySymbol = useCurrencySymbol();

    const barSize = selectedMonths <= 12 ? 24 : 14;

    return (
        <div className="">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    Cashflow mensual
                </h3>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    <Tooltip
                        contentStyle={tooltipContentStyle}
                        itemSorter={(item) => item.dataKey === "ingresos" ? -1 : 1}
                        formatter={(value, name) => [
                            <span className="font-semibold">
                                ${Number(value).toLocaleString("es-ES")} ${currencySymbol}
                            </span>,
                            name === "ingresos" ? "Ingresos" : "Gastos",
                        ]}
                        labelStyle={{
                            fontWeight: 500,
                            color: "hsl(var(--foreground))"
                        }}
                        cursor={false}
                    />
                    <Bar
                        dataKey="ingresos"
                        fill={COLOR_INCOME}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={barSize}
                        name="ingresos"
                    />
                    <Bar
                        dataKey="gastos"
                        fill={COLOR_EXPENSE_NORMAL}
                        shape={<ExpenseBar />}
                        maxBarSize={barSize}
                        name="gastos"
                    />
                </BarChart>
            </ResponsiveContainer>

            {/* Leyenda manual — más fiable que Legend de Recharts con shapes personalizados */}
            <div className="flex items-center justify-center mt-4 space-x-6">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLOR_INCOME }}
                    />
                    <span className="text-sm text-muted-foreground">
                        Ingresos
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLOR_EXPENSE_NORMAL }}
                    />
                    <span className="text-sm text-muted-foreground">
                        Gasto normal
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLOR_EXPENSE_PEAK }}
                    />
                    <span className="text-sm text-muted-foreground">
                        Pico de gasto (&gt;130% media)
                    </span>
                </div>
            </div>
        </div>
    );
};