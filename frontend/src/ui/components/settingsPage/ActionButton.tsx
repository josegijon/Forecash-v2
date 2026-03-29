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
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer group ${variant === "dashed"
                ? "border-2 border-dashed border-border hover:border-primary/30 hover:bg-primary/5"
                : "border border-border bg-background hover:bg-muted/60"
            }`}
    >
        <span
            className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${iconBg} ${iconBorder}`}
        >
            {icon}
        </span>
        <div className="text-left flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground truncate">{sublabel}</p>
        </div>
        {actionIcon}
    </button>
);