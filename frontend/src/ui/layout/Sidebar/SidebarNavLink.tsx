import { NavLink } from "react-router";

interface SidebarNavLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
};

export const SidebarNavLink = ({ to, icon, label, onClick }: SidebarNavLinkProps) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }: { isActive: boolean }) =>
            `w-full relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer group text-card-foreground
        ${isActive
                ? 'bg-primary/30 text-primary'
                : ' hover:bg-primary/10 hover:text-primary hover:shadow-[inset_0_0_0_1px] hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            }`
        }
    >
        {({ isActive }: { isActive: boolean }) => (
            <>
                {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></span>
                )}
                <span className={`transition-transform text-primary ${!isActive ? 'group-hover:scale-110' : ''}`}>
                    {icon}
                </span>
                <span className="truncate font-medium">{label}</span>
            </>
        )}
    </NavLink>
);