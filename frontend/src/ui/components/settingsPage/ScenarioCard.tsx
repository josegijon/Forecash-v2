import { useRef, useEffect } from "react";
import type { Scenario } from "@/store";
import { Check, X, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ScenarioCardProps {
    scenario: Scenario;
    isEditing: boolean;
    editingName: string;
    menuOpen: boolean;
    canDelete: boolean;
    isPendingDelete: boolean;
    onEditingNameChange: (name: string) => void;
    onConfirmEdit: () => void;
    onCancelEdit: () => void;
    onMenuToggle: () => void;
    onStartEdit: () => void;
    onDeleteRequest: () => void;
    onConfirmDelete: () => void;
    onCancelDelete: () => void;
}

export const ScenarioCard = ({
    scenario,
    isEditing,
    editingName,
    menuOpen,
    canDelete,
    isPendingDelete,
    onEditingNameChange,
    onConfirmEdit,
    onCancelEdit,
    onMenuToggle,
    onStartEdit,
    onDeleteRequest,
    onConfirmDelete,
    onCancelDelete,
}: ScenarioCardProps) => {
    // Ref local — no depende del padre para el click-outside
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onMenuToggle();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen, onMenuToggle]);

    return (
        <div
            className={`relative flex flex-col gap-3 p-4 rounded-2xl bg-background border transition-all group ${isPendingDelete
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-border hover:border-primary/30 hover:shadow-sm"
                }`}
        >
            <div className="flex gap-1">
                <div className="w-full flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 shadow-sm shadow-primary/30" />
                    {isEditing ? (
                        <input
                            autoFocus
                            value={editingName}
                            onChange={(e) => onEditingNameChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") onConfirmEdit();
                                if (e.key === "Escape") onCancelEdit();
                            }}
                            className="w-full flex-1 text-sm font-semibold bg-card px-2 py-1 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                        />
                    ) : (
                        <span className="text-sm font-semibold text-foreground truncate">
                            {scenario.name}
                        </span>
                    )}
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onConfirmEdit}
                            aria-label={`Confirmar edición de ${scenario.name}`}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-success/10 hover:text-success hover:border-success/30 transition-colors cursor-pointer"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={onCancelEdit}
                            aria-label="Cancelar edición"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : isPendingDelete ? (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onConfirmDelete}
                            aria-label={`Confirmar eliminación de ${scenario.name}`}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={onCancelDelete}
                            aria-label="Cancelar eliminación"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={onMenuToggle}
                            aria-label={`Opciones de ${scenario.name}`}
                            aria-expanded={menuOpen}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-8 z-10 bg-card border border-border rounded-2xl shadow-lg py-1 w-40 overflow-hidden">
                                <button
                                    onClick={onStartEdit}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                    <Pencil size={14} />
                                    Renombrar
                                </button>
                                <button
                                    onClick={onDeleteRequest}
                                    disabled={!canDelete}
                                    title={
                                        !canDelete
                                            ? "No puedes eliminar el único escenario"
                                            : undefined
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-destructive hover:bg-destructive/10 disabled:hover:bg-transparent"
                                >
                                    <Trash2 size={14} />
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Warning inline al confirmar borrado */}
            {isPendingDelete && (
                <p className="text-xs text-destructive font-medium ml-5">
                    ¿Eliminar este escenario y todos sus ítems?
                </p>
            )}
        </div>
    );
};