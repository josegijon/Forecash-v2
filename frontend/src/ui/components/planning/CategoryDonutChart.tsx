import { useMemo } from "react"
import { useCurrencySymbol, useCategoryStore, useScenarioStore, useScenarioItems } from "@/store"
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts"
import { isActiveMonth } from "@core"

export interface CategoryChartData {
    name: string
    value: number
    fill: string
}

//? Que pasa si hay más categorías que colores? Se repiten o se generan nuevos colores? Por ahora se repiten, pero podría ser buena idea generar nuevos colores dinámicamente si se supera el límite
const CATEGORY_COLORS = [
    "#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#ec4899",
    "#ef4444", "#8b5cf6", "#14b8a6", "#f97316", "#06b6d4",
]

interface CategoryDonutChartProps {
    type: "expense" | "income"
    year: number
    month: number
}

export function useCategoryChartData(type: "expense" | "income", year: number, month: number): CategoryChartData[] {
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId)
    const items = useScenarioItems(activeScenarioId)
    const categories = useCategoryStore((s) => s.categories)

    return useMemo(() => {
        const filteredItems = items.filter(
            (item) => item.type === type && isActiveMonth({ item, year, month })
        )

        // Agrupar por categoría
        const categoryMap = new Map<string, number>()
        for (const item of filteredItems) {
            const current = categoryMap.get(item.categoryId) ?? 0
            categoryMap.set(item.categoryId, current + item.amount)
        }

        // Convertir a array con nombre y color
        const data: CategoryChartData[] = []
        let colorIndex = 0
        for (const [categoryId, total] of categoryMap) {
            const cat = categories.find((c) => c.id === categoryId)
            data.push({
                name: cat?.name ?? "Sin categoría",
                value: total,
                fill: CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length],
            })
            colorIndex++
        }

        // Ordenar de mayor a menor
        data.sort((a, b) => b.value - a.value)

        return data
    }, [items, categories, type, year, month])
}

const CustomTooltip = ({ active, payload, total }: {
    active?: boolean
    payload?: { name: string; value: number; payload: CategoryChartData }[]
    total: number
}) => {
    if (!active || !payload?.length) return null
    const { name, value, payload: cat } = payload[0]
    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0"

    const currencySymbol = useCurrencySymbol()

    // Tooltip
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

export const CategoryDonutChart = ({ type, year, month }: CategoryDonutChartProps) => {
    const data = useCategoryChartData(type, year, month)
    const total = data.reduce((sum, cat) => sum + cat.value, 0)
    const currencySymbol = useCurrencySymbol()

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-52 text-sm text-slate-400">
                No hay datos para este mes
            </div>
        )
    }

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
    )
}