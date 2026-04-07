import { useState } from "react";
import { Layers, PlusCircle } from "lucide-react";
import type { Scenario } from "@/store";
import { ScenarioCard } from "./ScenarioCard";
import { Button } from "@/ui/primitives/Button";
import { Input } from "@/ui/primitives/Input";

interface ScenarioManagerCardProps {
    scenarios: Scenario[];
    onAdd: (name: string) => void;
    onRename: (id: string, name: string) => void;
    onDelete: (id: string) => void;
}

export const ScenarioManagerCard = ({
    scenarios,
    onAdd,
    onRename,
    onDelete,
}: ScenarioManagerCardProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [menuId, setMenuId] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [newName, setNewName] = useState("");
    const [inputError, setInputError] = useState<string | null>(null);

    const handleAdd = () => {
        const trimmed = newName.trim();
        if (!trimmed) {
            setInputError("El nombre no puede estar vacío");
            return;
        }
        const duplicate = scenarios.some(
            (s) => s.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (duplicate) {
            setInputError("Ya existe un escenario con ese nombre");
            return;
        }
        onAdd(trimmed);
        setNewName("");
        setInputError(null);
    };

    const startEditing = (s: Scenario) => {
        setPendingDeleteId(null);
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
        setEditingId(null);
        setPendingDeleteId(id);
        setMenuId(null);
    };

    const handleDeleteConfirm = () => {
        if (pendingDeleteId) onDelete(pendingDeleteId);
        setPendingDeleteId(null);
    };

    const handleDeleteCancel = () => setPendingDeleteId(null);

    return (
        <div className="rounded-2xl border border-border/40 bg-card text-card-foreground shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-primary/10">
                        <Layers size={13} className="text-primary" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Escenarios
                    </span>
                </div>
                <span
                    aria-label={`${scenarios.length} escenarios`}
                    className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary tabular-nums"
                >
                    {scenarios.length}
                </span>
            </div>

            {/* Grid de escenarios */}
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {scenarios.map((scenario) => (
                        <ScenarioCard
                            key={scenario.id}
                            scenario={scenario}
                            isEditing={editingId === scenario.id}
                            editingName={editingName}
                            menuOpen={menuId === scenario.id}
                            canDelete={scenarios.length > 1}
                            isPendingDelete={pendingDeleteId === scenario.id}
                            onEditingNameChange={setEditingName}
                            onConfirmEdit={confirmEdit}
                            onCancelEdit={cancelEdit}
                            onMenuToggle={() =>
                                setMenuId(menuId === scenario.id ? null : scenario.id)
                            }
                            onStartEdit={() => startEditing(scenario)}
                            onDeleteRequest={() => handleDeleteRequest(scenario.id)}
                            onConfirmDelete={handleDeleteConfirm}
                            onCancelDelete={handleDeleteCancel}
                        />
                    ))}
                </div>
            </div>

            {/* Input nuevo escenario */}
            <div className="px-4 pb-4">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <Input
                            variant="settings"
                            id="new-scenario-name"
                            aria-label="Nombre del nuevo escenario"
                            value={newName}
                            onChange={(e) => { setNewName(e.target.value); setInputError(null); }}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            placeholder="Nombre del nuevo escenario…"
                            error={!!inputError}
                        />
                        <Button
                            size="sm"
                            onClick={() => handleAdd()}
                            disabled={!newName.trim()}
                            aria-label="Añadir escenario"
                        >
                            <PlusCircle size={14} />
                            Añadir
                        </Button>
                    </div>
                    {inputError && (
                        <p className="text-xs text-destructive font-medium pl-1">
                            {inputError}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};