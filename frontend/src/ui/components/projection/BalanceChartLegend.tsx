import type { ReactNode } from "react";

// ─── LegendItem ───────────────────────────────────────────────────────────────

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

// ─── MilestoneBadge ───────────────────────────────────────────────────────────

export type MilestoneVariant = "success" | "danger" | "warning";

const MILESTONE_CLASSES: Record<MilestoneVariant, string> = {
    success: "bg-success/10 border-success/20 text-success",
    danger: "bg-badge-danger-bg border-badge-danger-fg/20 text-badge-danger-fg",
    warning: "bg-badge-warning-bg border-badge-warning-fg/20 text-badge-warning-fg",
};

export interface MilestoneBadgeProps {
    icon: ReactNode;
    label: string;
    variant: MilestoneVariant;
}

export const MilestoneBadge = ({ icon, label, variant }: MilestoneBadgeProps) => (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${MILESTONE_CLASSES[variant]}`}>
        {icon}
        {label}
    </div>
);