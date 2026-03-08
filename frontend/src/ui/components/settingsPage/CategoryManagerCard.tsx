import { useState } from "react";
import { Tags, PlusCircle, Pencil, Trash2, Check, X } from "lucide-react";
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
    const iconColor = isExpense ? "text-rose-500" : "text-emerald-500";
    const dotColor = isExpense ? "bg-rose-400" : "bg-emerald-400";
    const title = isExpense ? "Categorías de Gastos" : "Categorías de Ingresos";

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
        <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-5">
                <Tags size={20} className={iconColor} />
                <h3 className="font-bold text-slate-900">{title}</h3>
            </div>

            <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 group hover:border-slate-200 transition-all"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className={`w-3 h-3 rounded-full shrink-0 ${dotColor}`} />
                            {editingId === cat.id ? (
                                <input
                                    autoFocus
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") confirmEdit();
                                        if (e.key === "Escape") cancelEdit();
                                    }}
                                    className="flex-1 text-sm font-medium bg-white px-2 py-1 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            ) : (
                                <span className="text-sm font-medium text-slate-700 truncate">{cat.name}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            {editingId === cat.id ? (
                                <>
                                    <button
                                        onClick={confirmEdit}
                                        className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer"
                                    >
                                        <Check size={14} />
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => startEditing(cat)}
                                        className="p-1.5 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(cat.id)}
                                        className="p-1.5 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 transition-all cursor-pointer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 mt-4">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Nueva categoría…"
                    className="flex-1 text-sm px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/5 px-3 py-2 rounded-xl border border-primary/20 transition-all cursor-pointer"
                >
                    <PlusCircle size={16} />
                    Añadir
                </button>
            </div>
        </div>
    );
};