import { useState, useEffect, useRef } from "react";
import { Layers, Plus, MoreVertical, Pencil, Trash2, Check, X } from "lucide-react";
import type { Scenario } from "@/store/scenarioStore";
import { ConfirmDeleteScenarioModal } from "@/ui/components/modals/ConfirmDeleteScenarioModal";

interface Props {
    scenarios: Scenario[];
    onAdd: (name: string) => void;
    onRename: (id: string, name: string) => void;
    onDelete: (id: string) => void;
}

export const ScenarioManagerCard = ({ scenarios, onAdd, onRename, onDelete }: Props) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [menuId, setMenuId] = useState<string | null>(null);
    const [newName, setNewName] = useState("");
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!menuId) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuId]);

    const startEditing = (s: Scenario) => {
        setEditingId(s.id);
        setEditingName(s.name);
        setMenuId(null);
    };

    const confirmEdit = () => {
        if (editingId !== null) {
            onRename(editingId, editingName);
            setEditingId(null);
        }
    };

    const cancelEdit = () => setEditingId(null);

    // Opens the confirmation modal instead of deleting immediately
    const handleDeleteRequest = (id: string) => {
        setPendingDeleteId(id);
        setMenuId(null);
    };

    const handleDeleteConfirm = () => {
        if (pendingDeleteId) {
            onDelete(pendingDeleteId);
        }
        setPendingDeleteId(null);
    };

    const handleDeleteCancel = () => {
        setPendingDeleteId(null);
    };

    const handleAdd = () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        setNewName("");
    };

    const pendingDeleteScenario = scenarios.find((s) => s.id === pendingDeleteId);

    return (
        <>
            <div className="bg-card-light rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Layers size={20} className="text-primary" />
                        <h3 className="font-bold text-slate-900">Escenarios</h3>
                    </div>
                </div>

                <p className="text-sm text-slate-500 mb-5">
                    Crea diferentes escenarios financieros para comparar estrategias. Cada escenario tiene sus propios ítems de efectivo independientes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {scenarios.map((scenario) => (
                        <div
                            key={scenario.id}
                            className="relative flex flex-col gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                        >
                            <div className="flex gap-1">
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                    <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 shadow-sm shadow-primary/30" />
                                    {editingId === scenario.id ? (
                                        <input
                                            autoFocus
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") confirmEdit();
                                                if (e.key === "Escape") cancelEdit();
                                            }}
                                            className="flex-1 text-sm font-semibold bg-white px-2 py-1 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-slate-800 truncate">{scenario.name}</span>
                                    )}
                                </div>

                                {editingId === scenario.id ? (
                                    <div className="flex items-center gap-1">
                                        <button onClick={confirmEdit} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer">
                                            <Check size={14} />
                                        </button>
                                        <button onClick={cancelEdit} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative" ref={menuId === scenario.id ? menuRef : null}>
                                        <button
                                            onClick={() => setMenuId(menuId === scenario.id ? null : scenario.id)}
                                            className="p-1.5 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-600 transition-all cursor-pointer"
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                        {menuId === scenario.id && (
                                            <div className="absolute right-0 top-8 z-10 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-40">
                                                <button
                                                    onClick={() => startEditing(scenario)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                                >
                                                    <Pencil size={14} />
                                                    Renombrar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRequest(scenario.id)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
                    ))}
                </div>

                {/* Añadir nuevo escenario */}
                <div className="flex items-center gap-2">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        placeholder="Nombre del nuevo escenario…"
                        className="flex-1 text-sm px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/5 px-3 py-2 rounded-xl border border-primary/20 transition-all cursor-pointer"
                    >
                        <Plus size={16} />
                        Nuevo
                    </button>
                </div>
            </div>

            {/* Confirmation modal — rendered outside the card but inside the fragment */}
            {pendingDeleteId && pendingDeleteScenario && (
                <ConfirmDeleteScenarioModal
                    scenarioName={pendingDeleteScenario.name}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </>
    );
};