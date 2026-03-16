import { useState, useEffect, useRef } from "react";
import { Layers, PlusCircle } from "lucide-react";
import type { Scenario } from "@/store";
import { ConfirmDeleteScenarioModal } from "@/ui/components/modals/ConfirmDeleteScenarioModal";
import { ScenarioCard } from "./ScenarioCard";

interface ScenarioManagerCardProps {
    scenarios: Scenario[];
    onAdd: (name: string) => void;
    onRename: (id: string, name: string) => void;
    onDelete: (id: string) => void;
}

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
            <div className="flex flex-col gap-6 p-6 rounded-3xl border-0 bg-card text-card-foreground shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/10">
                            <Layers size={15} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-medium leading-none tracking-tight">
                            Escenarios
                        </h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                        {scenarios.length}
                    </span>
                </div>

                <p className="text-sm text-muted-foreground -mt-2">
                    Crea diferentes escenarios financieros para comparar estrategias. Cada escenario tiene sus propios ítems de efectivo independientes.
                </p>

                {/* Grid de escenarios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

                {/* Input nuevo escenario */}
                <div className="flex items-center gap-2">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        placeholder="Nombre del nuevo escenario…"
                        className="flex-1 text-sm px-3 py-2 h-10 bg-background rounded-2xl border border-border placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer transition-colors"
                    >
                        <PlusCircle size={16} />
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