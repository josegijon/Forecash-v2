
interface RatioProgressBarProps {
    label: string;
    percentage: number;
    color: string;
}

export const RatioProgressBar = ({ label, percentage, color }: RatioProgressBarProps) => {

    const formattedPercentage = percentage.toFixed(2);

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {label}
                </span>
                <span className={`text-xl font-bold`} style={{ color }}>
                    {formattedPercentage}%
                </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full`}
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                >
                </div>
            </div>
        </div>
    )
}
