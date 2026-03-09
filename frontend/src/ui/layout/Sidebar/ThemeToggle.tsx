import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toogle = () => {
        const next = !isDarkMode;
        setIsDarkMode(next);
        document.documentElement.classList.toggle("dark", next);
    };

    return (
        <div className="p-4">
            <button
                onClick={toogle}
                className="group w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-transparent bg-card hover:bg-accent hover:border-border hover:shadow-md transition-all duration-300 ease-in-out active:scale-95 cursor-pointer"
            >
                <div className="relative">
                    {isDarkMode ? (
                        <Moon
                            size={20}
                            className="text-slate-600 group-hover:text-indigo-600 transition-all duration-300"
                        />
                    ) : (
                        <Sun
                            size={20}
                            className="text-amber-500 group-hover:text-amber-600 transition-all duration-300 group-hover:rotate-90"
                        />
                    )}
                </div>
            </button>
        </div>
    );
};