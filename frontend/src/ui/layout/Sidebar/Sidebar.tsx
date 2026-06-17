import { NavLink, useParams } from "react-router";
import { SidebarNavigation } from "./SidebarNavigation";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/images/logo-1.png";

interface SidebarProps {
    onClose: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
    const { id } = useParams();

    return (
        <div className="sticky top-0 flex flex-col justify-between h-screen shadow-sm border-r border-border">
            {/* Header */}
            <div className="p-6 flex shrink-0 items-center border-b border-border">
                <NavLink
                    to={`/escenario/${id}/planificacion`}
                    className="flex items-center gap-2"
                >
                    <img
                        src={logo}
                        alt=""
                        className="w-10 object-contain"
                    />

                    <span className="font-semibold text-2xl text-foreground tracking-tight">
                        <span className="text-primary">Fore</span>cash
                    </span>
                </NavLink>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <SidebarNavigation onClose={onClose} />
            </nav>

            <ThemeToggle />
        </div>
    );
};
