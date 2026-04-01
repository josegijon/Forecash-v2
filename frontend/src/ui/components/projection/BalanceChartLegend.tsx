export interface LegendItemProps {
    color: string;
    label: string;
    dashed?: boolean;
}

export const LegendItem = ({ color, label, dashed }: LegendItemProps) => (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <svg width="22" height="10">
            <line
                x1="0" y1="5" x2="22" y2="5"
                stroke={color} strokeWidth="2"
                strokeDasharray={dashed ? "5 3" : undefined}
            />
        </svg>
        {label}
    </div>
);