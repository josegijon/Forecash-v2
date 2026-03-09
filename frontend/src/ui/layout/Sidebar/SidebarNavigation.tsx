import { Database, FlaskConical, LayoutDashboard, LineChart } from "lucide-react"
import { useParams } from "react-router"

import { SidebarNavLink } from "./SidebarNavLink"

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

export const SidebarNavigation = () => {
    const { id } = useParams();

    return (
        <>
            <p className="px-2 mb-3 text-xs font-semibold text-muted-foreground uppercase">
                Menú Principal
            </p>

            {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
                <SidebarNavLink
                    key={path}
                    to={`/escenario/${id}/${path}`}
                    icon={<Icon size={20} />}
                    label={label}
                />
            ))}
        </>
    )
}