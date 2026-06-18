import { NavLink, useParams } from "react-router";
import { Database, FlaskConical, LayoutDashboard, LineChart } from "lucide-react";
import { SidebarNavLink } from "./SidebarNavLink";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/images/logo-1.png";

const NAV_ITEMS = [
    {
        path: 'planificacion',
        icon: LayoutDashboard,
        label: 'Planificación'
    },
    {
        path: 'simulaciones',
        icon: FlaskConical,
        label: 'Simulaciones'
    },
    {
        path: 'proyeccion',
        icon: LineChart,
        label: 'Proyección'
    },
    {
        path: 'datos',
        icon: Database,
        label: 'Datos / Ajustes'
    }
];

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
                <p className="px-2 mb-3 text-xs font-semibold text-muted-foreground uppercase">
                    Menú Principal
                </p>

                {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
                    <SidebarNavLink
                        key={path}
                        to={`/escenario/${id}/${path}`}
                        icon={<Icon size={20} />}
                        label={label}
                        onClick={onClose}
                    />
                ))}
            </nav>

            <ThemeToggle />
        </div>
    );
};
