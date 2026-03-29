import { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, Check, X, Tag } from "lucide-react";
import type { Category } from "@/store";
import { useCashflowStore } from "@/store";

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

    // Leer todos los items para calcular cuántos usa cada categoría
    const allItemsMap = useCashflowStore((s) => s.items);

    const itemCountByCategory = (catId: string) =>
        Object.values(allItemsMap).reduce(
            (acc, scenarioItems) =>
                acc + scenarioItems.filter((item) => item.categoryId === catId).length,
            0
        );

    // Si cambian las categorías (e.g. una se eliminó), cerrar estado pendiente
    useEffect(() => {
        setPendingDeleteId(null);
        setEditingId(null);
    }, [categories]);

    const isExpense = type === "expense";
    const dotColor = isExpense ? "bg-chart-line" : "bg-success";
    const accentText = isExpense ? "text-chart-line" : "text-success";
    const accentBg = isExpense ? "bg-chart-fill" : "bg-success/10";
    const title = isExpense ? "Categorías de Gastos" : "Categorías de Ingresos";

    // ── Añadir ────────────────────────────────────────────────────────────────
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

    // ── Editar ────────────────────────────────────────────────────────────────
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

    // ── Borrar (inline confirm) ───────────────────────────────────────────────
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
        <div className="flex flex-col justify-between gap-6 p-6 rounded-3xl border-0 bg-card text-card-foreground shadow-sm">

            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accentBg}`}>
                            <Tag size={15} className={accentText} />
                        </div>
                        <h3 className="text-lg font-medium leading-none tracking-tight">
                            {title}
                        </h3>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${accentBg} ${accentText}`}>
                        {categories.length}
                    </span>
                </div>

                {/* Lista */}
                <div className="flex flex-col">
                    {categories.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Las categorías organizan tus{" "}
                                {isExpense ? "gastos" : "ingresos"} en la planificación.
                                <br />
                                Añade al menos una para empezar.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {SUGGESTIONS[type].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleAdd(s)}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer
                                        ${accentBg} ${accentText} border-current/20
                                        hover:opacity-80`}
                                    >
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        categories.map((cat, i) => {
                            const affectedCount = itemCountByCategory(cat.id);
                            const isPendingDelete = pendingDeleteId === cat.id;

                            return (
                                <div
                                    key={cat.id}
                                    className={`flex flex-col py-3 gap-1.5 ${i < categories.length - 1 ? "border-b border-border" : ""}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
                                            {editingId === cat.id ? (
                                                <input
                                                    autoFocus
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") confirmEdit();
                                                        if (e.key === "Escape") cancelEdit();
                                                    }}
                                                    className="flex-1 text-sm font-medium bg-background px-2 py-1 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
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
                                                    <button
                                                        onClick={confirmEdit}
                                                        aria-label={`Confirmar edición de ${cat.name}`}
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-success/10 hover:text-success hover:border-success/30 transition-colors cursor-pointer"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        aria-label="Cancelar edición"
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            ) : isPendingDelete ? (
                                                <>
                                                    <button
                                                        onClick={() => confirmDelete(cat.id)}
                                                        aria-label={`Confirmar eliminación de ${cat.name}`}
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                    <button
                                                        onClick={cancelDelete}
                                                        aria-label="Cancelar eliminación"
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEditing(cat)}
                                                        aria-label={`Editar categoría ${cat.name}`}
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => requestDelete(cat.id)}
                                                        aria-label={`Eliminar categoría ${cat.name}`}
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Warning inline al confirmar borrado */}
                                    {isPendingDelete && affectedCount > 0 && (
                                        <p className="text-xs text-badge-warning-fg ml-5 font-medium">
                                            ⚠ {affectedCount}{" "}
                                            {affectedCount === 1 ? "ítem pasará" : "ítems pasarán"} a
                                            «Sin categoría»
                                        </p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Input nueva categoría */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor={`new-cat-${type}`} className="sr-only">
                    Nueva categoría de {isExpense ? "gasto" : "ingreso"}
                </label>
                <div className="flex items-center gap-2">
                    <input
                        id={`new-cat-${type}`}
                        value={newName}
                        onChange={(e) => { setNewName(e.target.value); setInputError(null); }}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        placeholder="Nueva categoría…"
                        className={`flex h-10 w-full rounded-3xl border bg-background px-3 py-2 text-sm
                            ring-offset-background placeholder:text-muted-foreground
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1
                            disabled:cursor-not-allowed disabled:opacity-50 text-foreground
                            transition-colors
                            ${inputError ? "border-destructive/60" : "border-primary/20"}`}
                    />
                    <button
                        onClick={() => handleAdd()}
                        disabled={!newName.trim()}
                        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 transition-colors ${newName.trim()
                            ? "hover:bg-primary/90 cursor-pointer"
                            : "opacity-40 cursor-not-allowed"}`}
                    >
                        <PlusCircle size={16} />
                        Añadir
                    </button>
                </div>
                {inputError && (
                    <p className="text-xs text-destructive font-medium pl-3">{inputError}</p>
                )}
            </div>

        </div>
    );
};