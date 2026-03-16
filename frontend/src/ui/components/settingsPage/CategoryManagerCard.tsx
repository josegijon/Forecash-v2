import { useState } from "react";
import { PlusCircle, Pencil, Trash2, Check, X, Tag } from "lucide-react";
import type { Category } from "@/store";

interface CategoryManagerCardProps {
    type: "expense" | "income";
    categories: Category[];
    onAdd: (name: string) => void;
    onRename: (id: string, name: string) => void;
    onDelete: (id: string) => void;
}

export const CategoryManagerCard = ({ type, categories, onAdd, onRename, onDelete }: CategoryManagerCardProps) => {
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    const isExpense = type === "expense";
    const dotColor = isExpense ? "bg-chart-line" : "bg-success";
    const accentText = isExpense ? "text-chart-line" : "text-success";
    const accentBg = isExpense ? "bg-chart-fill" : "bg-success/10";
    const title = isExpense ? "Categorías de Gastos" : "Categorías de Ingresos";
    const count = categories.length;

    const handleAdd = () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        setNewName("");
    };

    const startEditing = (cat: Category) => {
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

    return (
        <div className="flex flex-col gap-6 p-6 rounded-3xl border-0 bg-card text-card-foreground shadow-sm">
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
                    {count}
                </span>
            </div>

            {/* Lista */}
            <div className="flex flex-col">
                {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Sin categorías todavía
                    </p>
                ) : (
                    categories.map((cat, i) => (
                        <div
                            key={cat.id}
                            className={`flex items-center justify-between py-3 ${i < categories.length - 1 ? "border-b border-border" : ""}`}
                        >
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
                                    <span className="text-sm font-medium text-foreground truncate">{cat.name}</span>
                                )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                {editingId === cat.id ? (
                                    <>
                                        <button
                                            onClick={confirmEdit}
                                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-success/10 hover:text-success hover:border-success/30 transition-colors cursor-pointer"
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                                        >
                                            <X size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEditing(cat)}
                                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(cat.id)}
                                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input nueva categoría */}
            <div className="flex items-center gap-2">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Nueva categoría…"
                    className="flex h-10 w-full rounded-3xl border border-primary/20 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                />
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer transition-colors"
                >
                    <PlusCircle size={16} />
                    Añadir
                </button>
            </div>
        </div>
    );
};