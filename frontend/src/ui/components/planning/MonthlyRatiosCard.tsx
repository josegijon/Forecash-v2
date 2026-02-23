import { PercentCircle } from "lucide-react"
import { RatioProgressBar } from "./RatioProgressBar";

interface MonthlyRatiosCardProps {
    title: string;
}

export const MonthlyRatiosCard = ({ title }: MonthlyRatiosCardProps) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PercentCircle size={18} className="text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 capitalize">
                    {title}
                </h3>
            </div>

            <div className="flex flex-col gap-4">
                <RatioProgressBar
                    label="Tasa de ahorro"
                    percentage={25}
                    color="#10b981"
                />

                <RatioProgressBar
                    label="Tasa de gasto"
                    percentage={75}
                    color="#ef4444"
                />
            </div>
        </div>
    )
}
