import React from "react";

interface StatCardProps {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: string;
    description: string;
    className?: string;
    children?: React.ReactNode;
}

export const StatCard = ({
    icon,
    iconBg,
    label,
    value,
    description,
    className = "",
    children
}: StatCardProps) => (
    <div className={`rounded-2xl border p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                {icon}
            </div>

            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {label}
            </span>
        </div>

        <p className="text-2xl font-bold text-slate-900">{value}</p>

        {children}

        <p className="text-xs text-slate-500 mt-1">
            {description}
        </p>
    </div>
);