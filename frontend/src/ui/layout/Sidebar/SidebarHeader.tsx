
interface SideBarHeaderProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const SidebarHeader = ({ icon, title, subtitle }: SideBarHeaderProps) => {
    return (
        <div className="p-6 border-b border-slate-100" >
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    {icon}
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tight text-slate-900">{title}</span>
                    {subtitle && <span className="text-[10px] text-slate-500 font-medium">{subtitle}</span>}
                </div>
            </div>
        </div>)
}
