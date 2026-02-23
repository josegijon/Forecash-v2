import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface CategoryData {
    name: string
    value: number
    fill: string
}

const MOCK_CATEGORIES: CategoryData[] = [
    { name: "Hogar", value: 870, fill: "#6366f1" },
    { name: "Alimentación", value: 350, fill: "#f59e0b" },
    { name: "Salud", value: 160, fill: "#10b981" },
    { name: "Transporte", value: 50, fill: "#3b82f6" },
    { name: "Entretenimiento", value: 25, fill: "#ec4899" },
]

export const CATEGORY_DATA = MOCK_CATEGORIES

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: CategoryData }[] }) => {
    if (!active || !payload?.length) return null
    const { name, value, payload: cat } = payload[0]
    const total = MOCK_CATEGORIES.reduce((s, c) => s + c.value, 0)
    const percent = ((value / total) * 100).toFixed(1)

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.fill }} />
                <span className="text-sm font-bold text-slate-800">{name}</span>
            </div>
            <p className="text-sm text-slate-600">
                €{value.toLocaleString("es-ES")} · <span className="font-semibold">{percent}%</span>
            </p>
        </div>
    )
}

export const CategoryDonutChart = () => {
    const total = MOCK_CATEGORIES.reduce((sum, cat) => sum + cat.value, 0)

    return (
        <div className="relative w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={MOCK_CATEGORIES}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="85%"
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                <span className="text-lg font-extrabold text-slate-800">
                    €{total.toLocaleString("es-ES")}
                </span>
            </div>
        </div>
    )
}
