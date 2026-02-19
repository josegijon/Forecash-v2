import { NavLink } from "react-router";

interface SidebarNavLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
};

export const SidebarNavLink = ({ to, icon, label }: SidebarNavLinkProps) => (
    <NavLink
        to={to}
        className={({ isActive }: { isActive: boolean }) =>
            `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer group 
        ${isActive
                ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-600 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
            }`
        }
    >
        <span className="transition-transform group-hover:scale-110">
            {icon}
        </span>
        <span className="font-medium">{label}</span>
    </NavLink>
);