import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts"

import { useCurrencySymbol } from "@/store"

import type { CategoryChartData } from "./buildCategoryChartData"

interface CategoryDonutChartProps {
    data: CategoryChartData[]
}

// Componente de gráfico de dona para mostrar la distribución de gastos o ingresos por categoría, con tooltip personalizado y total en el centro
const CustomTooltip = ({ active, payload, total }: {
    active?: boolean
    payload?: { name: string; value: number; payload: CategoryChartData }[]
    total: number
}) => {
    if (!active || !payload?.length) return null;
    const { name, value, payload: cat } = payload[0];
    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0";

    const currencySymbol = useCurrencySymbol();

    return (
        <div className="relative z-50 bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
                <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.fill }}
                />

                <span className="text-sm font-bold text-slate-800">
                    {name}
                </span>
            </div>

            <p className="text-sm text-slate-600 z-90">
                {currencySymbol}{value.toLocaleString("es-ES")}
                ·
                <span className="font-semibold">
                    {percent}%
                </span>
            </p>
        </div>
    )
}

// Componente de gráfico de dona para mostrar la distribución de gastos o ingresos por categoría, con tooltip personalizado y total en el centro
export const CategoryDonutChart = ({ data }: CategoryDonutChartProps) => {
    const total = data.reduce((sum, cat) => sum + cat.value, 0);
    const currencySymbol = useCurrencySymbol();

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-52 text-sm text-slate-400">
                No hay datos para este mes
            </div>
        );
    };

    return (
        <div className="relative w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="85%"
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                    />
                    <Tooltip
                        content={<CustomTooltip total={total} />}
                        wrapperStyle={{ zIndex: 10 }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Total
                </span>

                <span className="text-lg font-extrabold text-slate-800">
                    {currencySymbol}{total.toLocaleString("es-ES")}
                </span>
            </div>
        </div>
    );
};