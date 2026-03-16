import { Menu } from "lucide-react";

import { ScenarioSelector } from "./ScenarioSelector";

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
    return (
        <header className="bg-background/60 backdrop-blur sticky top-0 z-40">
            <div className="h-full px-4 md:px-8 py-4 flex items-center justify-between gap-4">
                {/* Botón menú móvil */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-md hover:bg-accent shrink-0 cursor-pointer transition-colors"
                    aria-label="Abrir menú"
                >
                    <Menu size={20} />
                </button>

                {/* Acciones derecha */}
                <div className="flex items-center gap-2 shrink-0">
                    <ScenarioSelector />
                </div>
            </div>
        </header>
    );
};