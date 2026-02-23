import { PercentCircle } from "lucide-react"
import { RatioProgressBar } from "./RatioProgressBar";

interface MonthlyRatiosCardProps {
    title: string;
}

export const MonthlyRatiosCard = ({ title }: MonthlyRatiosCardProps) => {
    return (
        <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <PercentCircle size={24} className="text-primary" />
                <h3 className="font-bold capitalize">
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
