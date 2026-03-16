import type { RefObject } from "react";
import type { Scenario } from "@/store";
import { Check, X, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ScenarioCardProps {
    scenario: Scenario;
    isEditing: boolean;
    editingName: string;
    menuOpen: boolean;
    canDelete: boolean;
    menuRef: RefObject<HTMLDivElement | null>;
    onEditingNameChange: (name: string) => void;
    onConfirmEdit: () => void;
    onCancelEdit: () => void;
    onMenuToggle: () => void;
    onStartEdit: () => void;
    onDeleteRequest: () => void;
}

export const ScenarioCard = ({
    scenario,
    isEditing,
    editingName,
    menuOpen,
    canDelete,
    menuRef,
    onEditingNameChange,
    onConfirmEdit,
    onCancelEdit,
    onMenuToggle,
    onStartEdit,
    onDeleteRequest,
}: ScenarioCardProps) => (
    <div className="relative flex flex-col gap-3 p-4 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-sm transition-all group">
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
                    <span className="text-sm font-semibold text-foreground truncate">{scenario.name}</span>
                )}
            </div>

            {isEditing ? (
                <div className="flex items-center gap-1">
                    <button
                        onClick={onConfirmEdit}
                        className="p-1.5 rounded-lg text-success hover:bg-success/10 transition-colors cursor-pointer"
                    >
                        <Check size={14} />
                    </button>
                    <button
                        onClick={onCancelEdit}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={onMenuToggle}
                        className="p-1.5 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground transition-all cursor-pointer"
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
                                title={!canDelete ? "No puedes eliminar el único escenario" : undefined}
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
    </div>
);