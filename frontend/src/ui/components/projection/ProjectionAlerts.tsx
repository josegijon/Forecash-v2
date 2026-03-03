import { AlertTriangle, ShieldAlert, TrendingUp } from "lucide-react";
import type { ProjectionAlert } from "./projectionTypes";

interface ProjectionAlertsProps {
    alerts: ProjectionAlert[];
}

const ALERT_STYLES = {
    danger: {
        container: "bg-red-50/70 border-red-200",
        icon: "bg-red-100",
        text: "text-red-800",
        IconComponent: ShieldAlert,
        iconColor: "text-red-600",
    },
    warning: {
        container: "bg-amber-50/70 border-amber-200",
        icon: "bg-amber-100",
        text: "text-amber-800",
        IconComponent: AlertTriangle,
        iconColor: "text-amber-600",
    },
    info: {
        container: "bg-emerald-50/70 border-emerald-200",
        icon: "bg-emerald-100",
        text: "text-emerald-800",
        IconComponent: TrendingUp,
        iconColor: "text-emerald-600",
    },
} as const;

export const ProjectionAlerts = ({ alerts }: ProjectionAlertsProps) => {
    if (alerts.length === 0) return null;

    return (
        <div className="space-y-3">
            {alerts.map((alert, i) => {
                const styles = ALERT_STYLES[alert.type];
                const { IconComponent } = styles;

                return (
                    <div
                        key={i}
                        className={`flex items-start gap-3 rounded-2xl border p-4 ${styles.container}`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${styles.icon}`}>
                            <IconComponent size={16} className={styles.iconColor} />
                        </div>
                        <p className={`text-sm font-medium ${styles.text}`}>
                            {alert.message}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};