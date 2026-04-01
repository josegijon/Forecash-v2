import type { AlertLevel } from "./rowAlert";

const BADGE_BASE = "inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-2";

const BADGE_CLASSES: Record<NonNullable<AlertLevel>, string> = {
    danger: `${BADGE_BASE} bg-badge-danger-bg text-badge-danger-fg`,
    warning: `${BADGE_BASE} bg-badge-warning-bg text-badge-warning-fg`,
    neutral: `${BADGE_BASE} bg-badge-neutral-bg text-badge-neutral-fg`,
};

const BADGE_LABELS: Record<NonNullable<AlertLevel>, string> = {
    danger: "Negativo",
    warning: "Pico",
    neutral: "Déficit",
};

interface InlineBadgeProps {
    level: NonNullable<AlertLevel>;
}

export const InlineBadge = ({ level }: InlineBadgeProps) => (
    <span className={BADGE_CLASSES[level]}>{BADGE_LABELS[level]}</span>
);