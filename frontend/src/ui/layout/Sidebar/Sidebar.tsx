import { Wallet } from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
    onClose: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
    return (
        <div className="sticky top-0 z-11 flex flex-col justify-between h-screen shadow-sm border-r border-border">
            {/* Header */}
            <SidebarHeader
                icon={<Wallet size={24} className="text-white" strokeWidth={2.5} />}
                title="Forecash"
            />

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <SidebarNavigation onClose={onClose} />
            </nav>

            <ThemeToggle />
        </div>
    );
};