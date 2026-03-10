import { useState } from "react";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div
            className="flex h-screen bg-background font-poppins text-foreground"
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        >
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-11 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`
                fixed lg:sticky top-0 z-30 h-screen
                w-64 border-r border-border
                transition-transform duration-300 bg-background
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-auto">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};