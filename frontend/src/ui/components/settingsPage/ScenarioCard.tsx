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
            className={`relative flex flex-col gap-2.5 p-3.5 rounded-xl border transition-all group ${isPendingDelete
                ? "border-destructive/40 bg-destructive/5"
                : "border-border/60 bg-background hover:border-primary/30 hover:bg-muted/20"
                }`}
        >
            <div className="flex items-center gap-2">
                <div className="w-full flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 shadow-sm shadow-primary/40" />
                    {isEditing ? (
                        <input
                            autoFocus
                            value={editingName}
                            onChange={(e) => onEditingNameChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") onConfirmEdit();
                                if (e.key === "Escape") onCancelEdit();
                            }}
                            className="w-full flex-1 text-sm font-semibold bg-card px-2 py-0.5 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                        />
                    ) : (
                        <span className="text-sm font-semibold text-foreground truncate">
                            {scenario.name}
                        </span>
                    )}
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-1 shrink-0">
                        <MiniBtn onClick={onConfirmEdit} aria-label={`Confirmar edición de ${scenario.name}`} variant="success">
                            <Check size={12} />
                        </MiniBtn>
                        <MiniBtn onClick={onCancelEdit} aria-label="Cancelar edición">
                            <X size={12} />
                        </MiniBtn>
                    </div>
                ) : isPendingDelete ? (
                    <div className="flex items-center gap-1 shrink-0">
                        <MiniBtn onClick={onConfirmDelete} aria-label={`Confirmar eliminación de ${scenario.name}`} variant="destructive">
                            <Check size={12} />
                        </MiniBtn>
                        <MiniBtn onClick={onCancelDelete} aria-label="Cancelar eliminación">
                            <X size={12} />
                        </MiniBtn>
                    </div>
                ) : (
                    <div className="relative shrink-0" ref={menuRef}>
                        <button
                            onClick={onMenuToggle}
                            aria-label={`Opciones de ${scenario.name}`}
                            aria-expanded={menuOpen}
                            className="p-1 rounded-lg text-muted-foreground/50 hover:bg-muted hover:text-foreground transition-all cursor-pointer sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <MoreVertical size={14} />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-7 z-10 bg-card border border-border rounded-xl shadow-lg py-1 w-36 overflow-hidden">
                                <button
                                    onClick={onStartEdit}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                    <Pencil size={13} />
                                    Renombrar
                                </button>
                                <button
                                    onClick={onDeleteRequest}
                                    disabled={!canDelete}
                                    title={!canDelete ? "No puedes eliminar el único escenario" : undefined}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-destructive hover:bg-destructive/10 disabled:hover:bg-transparent"
                                >
                                    <Trash2 size={13} />
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isPendingDelete && (
                <p className="text-xs text-destructive font-medium ml-4">
                    ¿Eliminar este escenario y todos sus ítems?
                </p>
            )}
        </div>
    );
};

// ── MiniBtn ───────────────────────────────────────────────────────────────────
type MiniVariant = "default" | "success" | "destructive";

const MiniBtn = ({
    onClick,
    children,
    "aria-label": ariaLabel,
    variant = "default",
}: {
    onClick: () => void;
    children: React.ReactNode;
    "aria-label": string;
    variant?: MiniVariant;
}) => {
    const styles: Record<MiniVariant, string> = {
        default: "border-border bg-background hover:bg-muted text-muted-foreground",
        success: "border-success/30 bg-success/10 text-success hover:bg-success/20",
        destructive: "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className={`inline-flex items-center justify-center h-6 w-6 rounded-lg border transition-colors cursor-pointer ${styles[variant]}`}
        >
            {children}
        </button>
    );
};