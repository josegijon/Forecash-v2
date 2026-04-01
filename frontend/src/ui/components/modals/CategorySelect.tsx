import { useEffect, useRef, useState } from "react";
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
    const listRef = useRef<HTMLUListElement>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const selectedName = categories.find((c) => c.id === selectedId)?.name;

    // Cierre por click fuera
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

    // Foco en la lista al abrir; reset del índice al cerrar
    useEffect(() => {
        if (open) {
            const initialIndex = categories.findIndex((c) => c.id === selectedId);
            setFocusedIndex(initialIndex >= 0 ? initialIndex : 0);
            // Esperar al siguiente frame para que el <ul> esté en el DOM
            requestAnimationFrame(() => listRef.current?.focus());
        } else {
            setFocusedIndex(-1);
        }
    }, [open]);

    const handleClose = () => {
        onOpenChange(false);
        onBlur();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
        if (categories.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusedIndex((i) => Math.min(i + 1, categories.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusedIndex((i) => Math.max(i - 1, 0));
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (focusedIndex >= 0) {
                    onSelect(categories[focusedIndex].id);
                    onOpenChange(false);
                }
                break;
            case "Escape":
                e.preventDefault();
                handleClose();
                break;
            case "Tab":
                handleClose();
                break;
        }
    };

    // Scroll automático del ítem enfocado si la lista tiene overflow
    useEffect(() => {
        if (!open || focusedIndex < 0 || !listRef.current) return;
        const item = listRef.current.children[focusedIndex] as HTMLElement | undefined;
        item?.scrollIntoView({ block: "nearest" });
    }, [focusedIndex, open]);

    return (
        <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Categoría
            </label>
            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    onClick={() => onOpenChange(!open)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer ${error ? "border-destructive/70 focus:ring-destructive/20" : "border-border"
                        }`}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls="category-listbox"
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
                        ref={listRef}
                        id="category-listbox"
                        role="listbox"
                        tabIndex={-1}
                        onKeyDown={handleKeyDown}
                        aria-activedescendant={
                            focusedIndex >= 0 ? `cat-option-${categories[focusedIndex]?.id}` : undefined
                        }
                        className="absolute z-10 mt-1.5 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1 focus:outline-none"
                    >
                        {categories.length === 0 ? (
                            <li className="px-4 py-2.5 text-sm text-muted-foreground">
                                No hay categorías disponibles
                            </li>
                        ) : (
                            categories.map((cat, index) => {
                                const isSelected = cat.id === selectedId;
                                const isFocused = index === focusedIndex;
                                return (
                                    <li
                                        key={cat.id}
                                        id={`cat-option-${cat.id}`}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => {
                                            onSelect(cat.id);
                                            onOpenChange(false);
                                        }}
                                        onMouseEnter={() => setFocusedIndex(index)}
                                        className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${isSelected
                                                ? "text-primary font-semibold bg-primary/5"
                                                : "text-foreground font-medium"
                                            } ${isFocused && !isSelected ? "bg-muted" : ""} ${isFocused && isSelected ? "bg-primary/10" : ""
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