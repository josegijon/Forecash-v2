import type { ReactNode } from "react";

interface ActionButtonProps {
    onClick: () => void;
    iconBg: string;
    iconBorder: string;
    icon: ReactNode;
    label: string;
    sublabel: string;
    actionIcon: ReactNode;
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
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group ${variant === "dashed"
                ? "border-2 border-dashed border-slate-200 hover:border-primary/30 hover:bg-primary/5"
                : "border border-slate-200 bg-slate-50 hover:bg-slate-100"
            }`}
    >
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center border ${iconBg} ${iconBorder}`}>
            {icon}
        </span>
        <div className="text-left flex-1">
            <p className="text-sm font-semibold text-slate-800">{label}</p>
            <p className="text-xs text-slate-500">{sublabel}</p>
        </div>
        {actionIcon}
    </button>
);