interface ToggleRowProps {
    emoji: string;
    label: string;
    sublabel?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}

export const ToggleRow = ({ emoji, label, sublabel, checked, onChange }: ToggleRowProps) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-all cursor-pointer ${checked ? "border-primary/50 bg-primary/10" : "border-border bg-card hover:border-border/80 hover:bg-muted/50"
            }`}
    >
        <span className="text-base shrink-0">{emoji}</span>
        <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-tight ${checked ? "text-foreground" : "text-foreground/80"}`}>{label}</p>
            {sublabel && (
                <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
            )}
        </div>
        <div className={`relative shrink-0 w-10 h-5.5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
            <div className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.75"}`} />
        </div>
    </button>
);