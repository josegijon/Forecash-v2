import { AlertTriangle, ShieldAlert, TrendingUp } from "lucide-react";
import type { ProjectionAlert } from "./projectionTypes";

interface ProjectionAlertsProps {
    alerts: ProjectionAlert[];
}

const ALERT_STYLES = {
    danger: {
        container: "bg-badge-danger-bg border-badge-danger-fg/20",
        icon: "bg-badge-danger-fg/15",
        text: "text-badge-danger-fg",
        iconColor: "text-badge-danger-fg",
        IconComponent: ShieldAlert,
    },
    warning: {
        container: "bg-badge-warning-bg border-badge-warning-fg/20",
        icon: "bg-badge-warning-fg/15",
        text: "text-badge-warning-fg",
        iconColor: "text-badge-warning-fg",
        IconComponent: AlertTriangle,
    },
    info: {
        container: "bg-success/10 border-success/20",
        icon: "bg-success/15",
        text: "text-success",
        iconColor: "text-success",
        IconComponent: TrendingUp,
    },
} as const;

export const ProjectionAlerts = ({ alerts }: ProjectionAlertsProps) => {
    if (alerts.length === 0) return null;

    return (
        <div className="space-y-3">
            {alerts.map((alert) => {
                const { container, icon, text, iconColor, IconComponent } = ALERT_STYLES[alert.type];

                return (
                    <div
                        key={alert.message}
                        className={`flex items-center gap-3 rounded-2xl border p-4 ${container}`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${icon}`}>
                            <IconComponent size={16} className={iconColor} />
                        </div>
                        <p className={`text-sm font-medium leading-snug ${text}`}>
                            {alert.message}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};