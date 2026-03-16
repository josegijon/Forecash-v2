import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { useSettingsStore } from "@/store";

export const ThemeToggle = () => {
    const theme = useSettingsStore((s) => s.theme);
    const toggleTheme = useSettingsStore((s) => s.toggleTheme);

    useEffect(() => {
        const isDark = theme === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        document.querySelector('meta[name="theme-color"]')
            ?.setAttribute("content", isDark ? "#060e09" : "#e8f5e9");
    }, [theme]);

    const isDark = theme === "dark";

    return (
        <div className="p-4">
            <button
                onClick={toggleTheme}
                className="group w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-transparent bg-card hover:bg-accent hover:border-border hover:shadow-md transition-all duration-300 ease-in-out active:scale-95 cursor-pointer"
            >
                <div className="relative">
                    {isDark ? (
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