import { useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Category {
    id: string;
    name: string;
}

interface CategorySelectProps {
    categories: Category[];
    selectedId: string;
    error?: string;
    onSelect: (id: string) => void;
    onBlur: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CategorySelect = ({
    categories,
    selectedId,
    error,
    onSelect,
    onBlur,
    open,
    onOpenChange,
}: CategorySelectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedName = categories.find((c) => c.id === selectedId)?.name;

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onOpenChange(false);
                onBlur();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onBlur, onOpenChange]);

    return (
        <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Categoría
            </label>
            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    onClick={() => onOpenChange(!open)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer ${error
                            ? "border-destructive/70 focus:ring-destructive/20"
                            : "border-border"
                        }`}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    <span className={selectedName ? "text-foreground" : "text-muted-foreground/50"}>
                        {selectedName ?? "Selecciona una categoría"}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                </button>

                {open && (
                    <ul
                        role="listbox"
                        className="absolute z-10 mt-1.5 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1"
                    >
                        {categories.length === 0 ? (
                            <li className="px-4 py-2.5 text-sm text-muted-foreground">
                                No hay categorías disponibles
                            </li>
                        ) : (
                            categories.map((cat) => {
                                const isSelected = cat.id === selectedId;
                                return (
                                    <li
                                        key={cat.id}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => {
                                            onSelect(cat.id);
                                            onOpenChange(false);
                                        }}
                                        className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${isSelected
                                                ? "text-primary font-semibold bg-primary/5"
                                                : "text-foreground font-medium hover:bg-muted"
                                            }`}
                                    >
                                        {cat.name}
                                        {isSelected && <Check size={14} className="text-primary shrink-0" />}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                )}
            </div>
            {error && (
                <p className="text-xs text-destructive mt-1.5 font-medium">{error}</p>
            )}
        </div>
    );
};