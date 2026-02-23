import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react"

interface SummaryCardProps {
    label: string
    value: string
    icon: React.ReactNode
    trend?: { value: string; positive: boolean }
    accentClass: string
    bgClass: string
}

const SummaryCard = ({ label, value, icon, trend, accentClass, bgClass }: SummaryCardProps) => (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${accentClass}`}>
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-xl font-extrabold text-slate-800">{value}</span>
            {trend && (
                <span className={`text-[11px] font-semibold ${trend.positive ? "text-emerald-500" : "text-rose-500"}`}>
                    {trend.positive ? "↑" : "↓"} {trend.value} vs mes anterior
                </span>
            )}
        </div>
    </div>
)

export const PlanningSummaryStrip = () => {
    const cards: SummaryCardProps[] = [
        {
            label: "Ingresos totales",
            value: "€3.200,00",
            icon: <TrendingUp size={22} />,
            trend: { value: "+5,2%", positive: true },
            accentClass: "text-emerald-600",
            bgClass: "bg-emerald-50",
        },
        {
            label: "Gastos totales",
            value: "€2.150,00",
            icon: <TrendingDown size={22} />,
            trend: { value: "+2,1%", positive: false },
            accentClass: "text-rose-600",
            bgClass: "bg-rose-50",
        },
        {
            label: "Balance neto",
            value: "€1.050,00",
            icon: <Wallet size={22} />,
            trend: { value: "+12,3%", positive: true },
            accentClass: "text-blue-600",
            bgClass: "bg-blue-50",
        },
        {
            label: "Ahorro acumulado",
            value: "€6.300,00",
            icon: <PiggyBank size={22} />,
            accentClass: "text-violet-600",
            bgClass: "bg-violet-50",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
                <SummaryCard key={card.label} {...card} />
            ))}
        </div>
    )
}
