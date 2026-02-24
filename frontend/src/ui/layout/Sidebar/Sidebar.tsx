import { Wallet } from "lucide-react"
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarSection } from "./SidebarSection";
import { ThemeToggle } from "./ThemeToggle";

export const Sidebar = () => {
    return (
        <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col sticky top-0 h-screen shadow-sm z-11">
            {/* Header */}
            <SidebarHeader
                icon={<Wallet size={24} className="text-white" strokeWidth={2.5} />}
                title="Forecash"
                subtitle="Planificación Financiera"
            />

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <SidebarNavigation />

                {/* Scenarios Section */}
                <SidebarSection />
            </nav>

            {/* Theme Toggle Button */}
            <ThemeToggle />
        </aside>
    )
}