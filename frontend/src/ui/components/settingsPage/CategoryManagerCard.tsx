import { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, Check, X, Tag } from "lucide-react";
import type { Category } from "@/store";
import { useCashflowStore } from "@/store";
import { Button } from "@/ui/primitives/Button";
import { Input } from "@/ui/primitives/Input";

interface CategoryManagerCardProps {
    type: "expense" | "income";
    categories: Category[];
    onAdd: (name: string) => void;
    onRename: (id: string, name: string) => void;
    onDelete: (id: string) => void;
}

const SUGGESTIONS: Record<"expense" | "income", string[]> = {
    expense: ["Alquiler", "Suscripciones", "Alimentación"],
    income: ["Salario", "Freelance", "Ingresos extra"],
};

export const CategoryManagerCard = ({
    type,
    categories,
    onAdd,
    onRename,
    onDelete,
}: CategoryManagerCardProps) => {
    const [newName, setNewName] = useState("");
    const [inputError, setInputError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const allItemsMap = useCashflowStore((s) => s.items);

    const itemCountByCategory = (catId: string) =>
        Object.values(allItemsMap).reduce(
            (acc, scenarioItems) =>
                acc + scenarioItems.filter((item) => item.categoryId === catId).length,
            0
        );

    useEffect(() => {
        setPendingDeleteId(null);
        setEditingId(null);
    }, [categories]);

    const isExpense = type === "expense";
    const accentText = isExpense ? "text-chart-line" : "text-success";
    const accentBg = isExpense ? "bg-chart-fill" : "bg-success/10";
    const dotColor = isExpense ? "bg-chart-line" : "bg-success";
    const title = isExpense ? "Gastos" : "Ingresos";

    const handleAdd = (name = newName) => {
        const trimmed = name.trim();
        if (!trimmed) {
            setInputError("El nombre no puede estar vacío");
            return;
        }
        const duplicate = categories.some(
            (c) => c.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (duplicate) {
            setInputError("Ya existe esta categoría");
            return;
        }
        onAdd(trimmed);
        setNewName("");
        setInputError(null);
    };

    const startEditing = (cat: Category) => {
        setPendingDeleteId(null);
        setEditingId(cat.id);
        setEditingName(cat.name);
    };

    const confirmEdit = () => {
        if (editingId !== null) {
            onRename(editingId, editingName);
            setEditingId(null);
        }
    };

    const cancelEdit = () => setEditingId(null);

    const requestDelete = (id: string) => {
        setEditingId(null);
        setPendingDeleteId(id);
    };

    const confirmDelete = (id: string) => {
        onDelete(id);
        setPendingDeleteId(null);
    };

    const cancelDelete = () => setPendingDeleteId(null);

    return (
        <div className="flex flex-col gap-0 rounded-2xl border border-border/40 bg-card text-card-foreground shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${accentBg}`}>
                        <Tag size={12} className={accentText} />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {title}
                    </span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${accentBg} ${accentText} tabular-nums`}>
                    {categories.length}
                </span>
            </div>

            {/* Lista */}
            <div className="flex-1">
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-8 px-5 text-center">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${accentBg}`}>
                            <Tag size={16} className={accentText} />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-55">
                            Las categorías organizan tus {isExpense ? "gastos" : "ingresos"}.
                            Añade al menos una para empezar.
                        </p>
                        <div className="flex flex-wrap justify-center gap-1.5">
                            {SUGGESTIONS[type].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleAdd(s)}
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${accentBg} ${accentText} border-current/20 hover:opacity-75`}
                                >
                                    + {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <ul>
                        {categories.map((cat, i) => {
                            const affectedCount = itemCountByCategory(cat.id);
                            const isPendingDelete = pendingDeleteId === cat.id;

                            return (
                                <li
                                    key={cat.id}
                                    className={`flex flex-col px-5 py-3 transition-colors ${isPendingDelete ? "bg-destructive/5" : "hover:bg-muted/30"} ${i < categories.length - 1 ? "border-b border-border/40" : ""}`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                                            {editingId === cat.id ? (
                                                <Input
                                                    variant="settings"
                                                    id={`new-cat-${type}`}
                                                    aria-label={`Nombre de la nueva categoría de ${isExpense ? "gasto" : "ingreso"}`}
                                                    value={newName}
                                                    onChange={(e) => { setNewName(e.target.value); setInputError(null); }}
                                                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                                    placeholder="Nueva categoría…"
                                                    error={!!inputError}
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-foreground truncate">
                                                    {cat.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            {editingId === cat.id ? (
                                                <>
                                                    <IconBtn onClick={confirmEdit} aria-label={`Confirmar edición de ${cat.name}`} variant="success">
                                                        <Check size={13} />
                                                    </IconBtn>
                                                    <IconBtn onClick={cancelEdit} aria-label="Cancelar edición">
                                                        <X size={13} />
                                                    </IconBtn>
                                                </>
                                            ) : isPendingDelete ? (
                                                <>
                                                    <IconBtn onClick={() => confirmDelete(cat.id)} aria-label={`Confirmar eliminación de ${cat.name}`} variant="destructive">
                                                        <Check size={13} />
                                                    </IconBtn>
                                                    <IconBtn onClick={cancelDelete} aria-label="Cancelar eliminación">
                                                        <X size={13} />
                                                    </IconBtn>
                                                </>
                                            ) : (
                                                <>
                                                    <IconBtn onClick={() => startEditing(cat)} aria-label={`Editar categoría ${cat.name}`}>
                                                        <Pencil size={13} />
                                                    </IconBtn>
                                                    <IconBtn onClick={() => requestDelete(cat.id)} aria-label={`Eliminar categoría ${cat.name}`} variant="ghost-destructive">
                                                        <Trash2 size={13} />
                                                    </IconBtn>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {isPendingDelete && affectedCount > 0 && (
                                        <p className="text-xs text-badge-warning-fg ml-4.5 mt-1 font-medium">
                                            ⚠ {affectedCount} {affectedCount === 1 ? "ítem pasará" : "ítems pasarán"} a «Sin categoría»
                                        </p>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Input nueva categoría */}
            <div className="px-5 py-4 border-t border-border/40 bg-background/50">
                <div className="flex items-center gap-2">
                    <input
                        id={`new-cat-${type}`}
                        aria-label={`Nombre de la nueva categoría de ${isExpense ? "gasto" : "ingreso"}`}
                        value={newName}
                        onChange={(e) => { setNewName(e.target.value); setInputError(null); }}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        placeholder="Nueva categoría…"
                        className={`flex h-9 w-full rounded-xl border bg-background px-3 py-2 text-sm
                            ring-offset-background placeholder:text-muted-foreground
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1
                            disabled:cursor-not-allowed disabled:opacity-50 text-foreground
                            transition-colors
                            ${inputError ? "border-destructive/60" : "border-border"}`}
                    />
                    <Button
                        size="sm"
                        onClick={() => handleAdd()}
                        disabled={!newName.trim()}
                        aria-label="Añadir categoría"
                    >
                        <PlusCircle size={14} />
                        Añadir
                    </Button>
                </div>
                {inputError && (
                    <p className="text-xs text-destructive font-medium pl-1 mt-1.5">{inputError}</p>
                )}
            </div>

        </div>
    );
};

// ── IconBtn ───────────────────────────────────────────────────────────────────
type IconBtnVariant = "default" | "success" | "destructive" | "ghost-destructive";

const IconBtn = ({
    onClick,
    children,
    "aria-label": ariaLabel,
    variant = "default",
}: {
    onClick: () => void;
    children: React.ReactNode;
    "aria-label": string;
    variant?: IconBtnVariant;
}) => {
    const styles: Record<IconBtnVariant, string> = {
        default: "border-border bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground",
        success: "border-success/30 bg-success/10 text-success hover:bg-success/20",
        destructive: "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
        "ghost-destructive": "border-border bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className={`inline-flex items-center justify-center h-7 w-7 rounded-lg border transition-colors cursor-pointer ${styles[variant]}`}
        >
            {children}
        </button>
    );
};