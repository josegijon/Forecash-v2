import { Menu } from "lucide-react";
import { useLocation } from "react-router";

import { ScenarioSelector } from "./ScenarioSelector";
import { ThemeToggle } from "../Sidebar/ThemeToggle";

const PAGE_TITLES: Record<string, string> = {
    planificacion: "Planificación Financiera",
    simulaciones: 'Simulador "What-If"',
    proyeccion: "Análisis de Futuro",
    datos: "Datos y Ajustes",
};

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
    // const location = useLocation();

    // const lastSegment = location.pathname.split("/").filter(Boolean).pop() ?? "";
    // const title = PAGE_TITLES[lastSegment] ?? "Forecash";

    return (
        <header className="bg-background/60 backdrop-blur sticky top-0 z-10">
            <div className="h-full px-4 md:px-8 py-4 flex items-center justify-between gap-4">
                {/* Botón menú móvil */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-md hover:bg-accent shrink-0 cursor-pointer transition-colors"
                    aria-label="Abrir menú"
                >
                    <Menu size={20} />
                </button>

                {/* Título y escenario activo */}
                {/* <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h1 className="text-2xl font-bold tracking-tight truncate">
                        {title}
                    </h1>
                </div> */}

                {/* Acciones derecha */}
                <div className="flex items-center gap-2 shrink-0">
                    <ScenarioSelector />
                </div>
            </div>
        </header>
    );
};