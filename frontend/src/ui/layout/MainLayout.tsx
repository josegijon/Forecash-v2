import { useState } from "react";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";
import { useLocation } from "react-router";

const PAGE_TITLES: Record<string, string> = {
    planificacion: "Planificación Financiera",
    simulaciones: 'Simulador "What-If"',
    proyeccion: "Análisis de Futuro",
    datos: "Datos y Ajustes",
};

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const location = useLocation();

    const lastSegment = location.pathname.split("/").filter(Boolean).pop() ?? "";
    const title = PAGE_TITLES[lastSegment] ?? "Forecash";

    return (
        <div
            className="flex h-screen bg-background font-poppins text-foreground"
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        >
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-49 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`
                fixed lg:sticky top-0 z-50 h-screen
                w-64 border-r border-border
                transition-transform duration-300 bg-background
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-auto">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 z-20 p-4 md:p-8">
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="max-w-6xl mx-auto space-y-6">
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <h1 className="text-2xl font-bold tracking-tight truncate">
                                    {title}
                                </h1>
                            </div>
                            {children}
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
};