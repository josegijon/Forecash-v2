interface RatioProgressBarProps {
    label: string;
    percentage: number;
    color: string;
    icon: React.ReactNode;
    iconBgClass: string;
}

export const RatioProgressBar = ({ label, percentage, color, icon, iconBgClass }: RatioProgressBarProps) => {
    // El ancho visual se clampea a 100%, pero el valor puede superarlo (overflow indicator)
    const barWidth = percentage <= 0 ? 100 : Math.min(percentage, 100);
    const isOverflow = percentage > 100;
    const formattedPercentage = Math.round(percentage);

    return (
        <div className="space-y-3 bg-card p-3 rounded-md shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${iconBgClass}`}>
                    {icon}
                </div>
                <span className="text-sm font-medium">
                    {label}
                </span>
                <div className="flex items-center gap-1.5 ml-auto">
                    {isOverflow && (
                        <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-badge-danger-bg text-badge-danger-fg">
                            exceso
                        </span>
                    )}
                    <span className="text-sm font-medium" style={{ color }}>
                        {formattedPercentage}%
                    </span>
                </div>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden relative">
                <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
};