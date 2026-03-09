import { NavLink, useParams } from "react-router";

interface SidebarHeaderProps {
    icon: React.ReactNode;
    title: string;
}

export const SidebarHeader = ({ icon, title }: SidebarHeaderProps) => {
    const { id } = useParams();

    return (
        <div className="p-6 flex shrink-0 items-center border-b border-border">
            <NavLink
                to={`/escenario/${id}/planificacion`}
                className="flex items-center gap-2"
            >
                <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-emerald-700 rounded-md flex items-center justify-center shadow-sm">
                    {icon}
                </div>

                <span className="font-semibold text-xl tracking-tight">
                    {title}
                </span>
            </NavLink>
        </div>
    );
};