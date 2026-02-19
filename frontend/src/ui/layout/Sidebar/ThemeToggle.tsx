import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
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
    )
}
