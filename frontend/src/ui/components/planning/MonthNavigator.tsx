import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { useState } from "react"

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export const MonthNavigator = () => {
    const [monthIndex, setMonthIndex] = useState(1) // Febrero
    const [year, setYear] = useState(2026)

    const goBack = () => {
        if (monthIndex === 0) {
            setMonthIndex(11)
            setYear((y) => y - 1)
        } else {
            setMonthIndex((m) => m - 1)
        }
    }

    const goForward = () => {
        if (monthIndex === 11) {
            setMonthIndex(0)
            setYear((y) => y + 1)
        } else {
            setMonthIndex((m) => m + 1)
        }
    }

    const isCurrentMonth = monthIndex === 1 && year === 2026

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 shadow-sm">
                <button
                    onClick={goBack}
                    className="p-2 hover:bg-slate-50 rounded-l-xl transition-colors cursor-pointer text-slate-500 hover:text-slate-700"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 min-w-40 justify-center">
                    <Calendar size={14} className="text-primary" />
                    <span className="font-bold text-slate-800 text-sm">
                        {MONTHS[monthIndex]} {year}
                    </span>
                </div>

                <button
                    onClick={goForward}
                    className="p-2 hover:bg-slate-50 rounded-r-xl transition-colors cursor-pointer text-slate-500 hover:text-slate-700"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {!isCurrentMonth && (
                <button
                    onClick={() => { setMonthIndex(1); setYear(2026) }}
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                    Hoy
                </button>
            )}
        </div>
    )
}
