import { Database, FlaskConical, LayoutDashboard, LineChart } from "lucide-react"
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
    const id = 1;

    return (
        <>
            <p className="px-3 mb-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
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
