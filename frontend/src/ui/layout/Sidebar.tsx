import { Database, FlaskConical, LayoutDashboard, LineChart, Moon, Plus, Sun, Wallet } from "lucide-react"
import { useState } from "react";
import { NavLink } from "react-router";

export const Sidebar = () => {

    const id = 1;

    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col sticky top-0 h-screen shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Wallet size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-slate-900">Forecash</span>
                        <span className="text-[10px] text-slate-500 font-medium">Planificación Financiera</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <p className="px-3 mb-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Menú Principal
                </p>

                <SidebarNavLink
                    to={`/escenario/${id}/planificacion`}
                    icon={<LayoutDashboard size={20} />}
                    label="Planificación"
                />
                <SidebarNavLink
                    to={`/escenario/${id}/simulaciones`}
                    icon={<FlaskConical size={20} />}
                    label="Simulaciones"
                />
                <SidebarNavLink
                    to={`/escenario/${id}/proyeccion`}
                    icon={<LineChart size={20} />}
                    label="Proyección"
                />
                <SidebarNavLink
                    to={`/escenario/${id}/datos`}
                    icon={<Database size={20} />}
                    label="Datos / Ajustes"
                />

                {/* Scenarios Section */}
                <div className="pt-6">
                    <div className="px-3 mb-3 flex justify-between items-center">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Escenarios
                        </p>
                        <button
                            // onClick={handleCreateScenario}
                            className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 hover:text-blue-700 transition-all flex items-center justify-center hover:scale-105 hover:shadow-md shadow-blue-200/50 cursor-pointer"
                            title="Crear nuevo escenario"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className='flex flex-col gap-1'>
                        {/* {allScenarios.map((scenario) => ( */}
                        <button
                            // key={scenario.id}
                            // onClick={() => handleSelectScenario(scenario.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all truncate group cursor-pointer 
                                ${id === 1
                                    ? 'bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            <div className="flex items-center gap-2.5">
                                <span className={`w-2 h-2 rounded-full transition-all 
                                    ${id === 1
                                        ? 'bg-blue-600 shadow-sm shadow-blue-300'
                                        : 'bg-slate-300 group-hover:bg-slate-400'
                                    }
                                    `
                                }></span>
                                <span className="truncate">Escenario 1</span>
                            </div>
                        </button>
                        {/* ))} */}
                    </div>
                </div>
            </nav>

            {/* Theme Toggle Button */}
            <div className="p-4 border-t border-slate-200 bg-white">
                <button
                    onClick={toggleTheme}
                    className="group w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 hover:shadow-md transition-all duration-300 ease-in-out active:scale-95 cursor-pointer"
                >
                    <div className="relative">
                        {isDarkMode ? (
                            <Moon size={20} className="text-slate-600 group-hover:text-indigo-600 transition-all duration-300" />
                        ) : (
                            <Sun size={20} className="text-amber-500 group-hover:text-amber-600 transition-all duration-300 group-hover:rotate-90" />
                        )}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors duration-300">
                        {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
                    </span>
                </button>
            </div>
        </aside>
    )
}


/**
 * NavLink del sidebar que usa React Router para resaltar la ruta activa.
 */
const SidebarNavLink = ({
    to,
    icon,
    label,
}: {
    to: string;
    icon: React.ReactNode;
    label: string;
}) => (
    <NavLink
        to={to}
        className={({ isActive }: { isActive: boolean }) =>
            `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer group 
        ${isActive
                ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-600 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
            }`
        }
    >
        <span className="transition-transform group-hover:scale-110">
            {icon}
        </span>
        <span className="font-medium">{label}</span>
    </NavLink>
);