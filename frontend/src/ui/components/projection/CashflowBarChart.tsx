import {
    XAxis, YAxis, Tooltip,
    ResponsiveContainer, Bar, BarChart,
} from "recharts";

import type { MonthData } from "../../utils/projectionTypes";
import { ExpenseBar, COLOR_EXPENSE_NORMAL, COLOR_EXPENSE_PEAK } from "./ExpenseBar";
import { CashflowTooltip } from "./CashflowTooltip";
import { useCashflowChartLayout } from "./useCashflowChartLayout";

interface CashflowBarChartProps {
    data: MonthData[];
    selectedMonths: number;
}

const COLOR_INCOME = "hsl(var(--primary))";

const tickFormatter = (v: number) => `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;

// ─── LegendItem ───────────────────────────────────────────────────────────────

interface LegendItemProps {
    color: string;
    label: string;
}

const LegendItem = ({ color, label }: LegendItemProps) => (
    <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
);

// ─── CashflowBarChart ─────────────────────────────────────────────────────────

export const CashflowBarChart = ({ data, selectedMonths }: CashflowBarChartProps) => {
    const { xAxisInterval, barSize, isMobile } = useCashflowChartLayout(selectedMonths);
    const hasPeaks = data.some((d) => d.isPeakExpense);

    const legendItems: LegendItemProps[] = [
        { color: COLOR_INCOME, label: "Ingresos" },
        { color: COLOR_EXPENSE_NORMAL, label: "Gastos" },
        ...(hasPeaks ? [{ color: COLOR_EXPENSE_PEAK, label: "Gasto elevado" }] : []),
    ];

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    Ingresos y gastos mensuales
                </h3>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    barCategoryGap={selectedMonths > 24 && isMobile ? "10%" : "20%"}
                >
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
                        tickFormatter={tickFormatter}
                    />
                    <Tooltip
                        content={<CashflowTooltip />}
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

            <div className="flex items-center justify-center gap-6 mt-4">
                {legendItems.map((item) => (
                    <LegendItem key={item.label} {...item} />
                ))}
            </div>
        </div>
    );
};