import { useEffect, useState } from "react";
import {
    XAxis, YAxis, Tooltip,
    ResponsiveContainer, Bar, BarChart, type BarProps,
} from "recharts";
import type { MonthData } from "../../utils/projectionTypes";
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

const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handler = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);
    return width;
}

const calcXAxisInterval = (selectedMonths: number, isMobile: boolean): number => {
    if (!isMobile) {
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

const calcBarSize = (selectedMonths: number, isMobile: boolean): number => {
    if (!isMobile) {
        return selectedMonths <= 12 ? 24 : 14;
    }
    // Mobile: barras más finas para que quepan
    if (selectedMonths <= 12) return 16;
    if (selectedMonths <= 24) return 8;
    return 4;
}

export const CashflowBarChart = ({ data, selectedMonths }: CashflowBarChartProps) => {
    const currencySymbol = useCurrencySymbol();
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 640;

    const xAxisInterval = calcXAxisInterval(selectedMonths, isMobile);
    const barSize = calcBarSize(selectedMonths, isMobile);

    return (
        <div className="">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-medium leading-none tracking-tight">
                    Cashflow mensual
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
                        contentStyle={tooltipContentStyle}
                        itemSorter={(item) => item.dataKey === "ingresos" ? -1 : 1}
                        formatter={(value, name) => [
                            <span className="font-semibold">
                                {Number(value).toLocaleString("es-ES")} {currencySymbol}
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
                <div className="flex items-center gap-2 flex-1">
                    <div
                        className="w-1 sm:w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLOR_INCOME }}
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                        Ingresos
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                    <div
                        className="w-1 sm:w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLOR_EXPENSE_NORMAL }}
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                        Gasto normal
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                    <div
                        className="w-1 sm:w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLOR_EXPENSE_PEAK }}
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                        Pico de gasto (&gt;130% media)
                    </span>
                </div>
            </div>
        </div>
    );
};