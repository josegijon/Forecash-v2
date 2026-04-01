import type { ReactNode } from "react";

interface ActionButtonProps {
    onClick: () => void;
    iconBg: string;
    iconBorder: string;
    icon: ReactNode;
    label: string;
    sublabel: string;
    actionIcon?: ReactNode;
    variant?: "solid" | "dashed";
}

export const ActionButton = ({
    onClick,
    iconBg,
    iconBorder,
    icon,
    label,
    sublabel,
    actionIcon,
    variant = "solid",
}: ActionButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer group ${variant === "dashed"
            ? "border-2 border-dashed border-border hover:border-primary/30 hover:bg-primary/5"
            : "border border-border/60 bg-background hover:bg-muted/40 hover:border-border"
            }`}
    >
        <span
            className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${iconBg} ${iconBorder}`}
        >
            {icon}
        </span>
        <div className="text-left flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">{label}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{sublabel}</p>
        </div>
        {actionIcon}
    </button>
);