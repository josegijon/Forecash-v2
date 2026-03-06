interface RatioProgressBarProps {
    label: string;
    percentage: number;
    color: string;
}

export const RatioProgressBar = ({ label, percentage, color }: RatioProgressBarProps) => {
    // Clamp the bar width: never below 0, cap visually at 100% but allow overflow indicator
    const barWidth = Math.min(Math.abs(percentage), 100);
    const isOverflow = percentage > 100;
    const formattedPercentage = percentage.toFixed(2);

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {label}
                </span>
                <div className="flex items-center gap-1.5">
                    {isOverflow && (
                        <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-red-100 text-red-500">
                            exceso
                        </span>
                    )}
                    <span className="text-xl font-bold" style={{ color }}>
                        {formattedPercentage}%
                    </span>
                </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
};