interface RatioProgressBarProps {
    label: string;
    percentage: number;
    color: string;
    icon: React.ReactNode;
    bgClass: string;
}

export const RatioProgressBar = ({ label, percentage, color, icon, bgClass }: RatioProgressBarProps) => {
    // El ancho visual se clampea a 100%, pero el valor puede superarlo (overflow indicator)
    const barWidth = Math.min(Math.abs(percentage), 100);
    const isOverflow = percentage > 100;
    const formattedPercentage = percentage.toFixed(2);

    return (
        <div className="space-y-3 bg-card p-3 rounded-md shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${bgClass} text-navy`}>
                    {icon}
                </div>
                <span className="text-sm font-medium">
                    {label}
                </span>
                <div className="flex items-center gap-1.5  ml-auto">
                    {isOverflow && (
                        <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-red-100 text-red-500">
                            exceso
                        </span>
                    )}
                    <span className="text-sm text-muted-foreground" style={{ color }}>
                        {formattedPercentage}%
                    </span>
                </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
};