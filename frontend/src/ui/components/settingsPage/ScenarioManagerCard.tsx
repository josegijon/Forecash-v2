import { useState, useEffect, useRef } from "react";
import { Layers, Plus } from "lucide-react";
import type { Scenario } from "@/store/scenarioStore";
import { ConfirmDeleteScenarioModal } from "@/ui/components/modals/ConfirmDeleteScenarioModal";
import { ScenarioCard } from "./ScenarioCard";

interface ScenarioManagerCardProps {
    scenarios: Scenario[];
    onAdd: (name: string) => void;
    onRename: (id: string, name: string) => void;
    onDelete: (id: string) => void;
}

// ── Componente principal ──────────────────────────────────────────────────────

export const ScenarioManagerCard = ({ scenarios, onAdd, onRename, onDelete }: ScenarioManagerCardProps) => {
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

    const handleDeleteRequest = (id: string) => {
        setPendingDeleteId(id);
        setMenuId(null);
    };

    const handleDeleteConfirm = () => {
        if (pendingDeleteId) onDelete(pendingDeleteId);
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
                <div className="flex items-center gap-2 mb-5">
                    <Layers size={20} className="text-primary" />
                    <h3 className="font-bold text-slate-900">Escenarios</h3>
                </div>

                <p className="text-sm text-slate-500 mb-5">
                    Crea diferentes escenarios financieros para comparar estrategias. Cada escenario tiene sus propios ítems de efectivo independientes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {scenarios.map((scenario) => (
                        <ScenarioCard
                            key={scenario.id}
                            scenario={scenario}
                            isEditing={editingId === scenario.id}
                            editingName={editingName}
                            menuOpen={menuId === scenario.id}
                            canDelete={scenarios.length > 1}
                            menuRef={menuId === scenario.id ? menuRef : { current: null }}
                            onEditingNameChange={setEditingName}
                            onConfirmEdit={confirmEdit}
                            onCancelEdit={cancelEdit}
                            onMenuToggle={() => setMenuId(menuId === scenario.id ? null : scenario.id)}
                            onStartEdit={() => startEditing(scenario)}
                            onDeleteRequest={() => handleDeleteRequest(scenario.id)}
                        />
                    ))}
                </div>

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

            {pendingDeleteId && pendingDeleteScenario && (
                <ConfirmDeleteScenarioModal
                    scenarioName={pendingDeleteScenario.name}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setPendingDeleteId(null)}
                />
            )}
        </>
    );
};