import { useState } from "react";
import { Layers, PlusCircle } from "lucide-react";
import type { Scenario } from "@/store";
import { ScenarioCard } from "./ScenarioCard";

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

    // ── Añadir ────────────────────────────────────────────────────────────────
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

    // ── Editar ────────────────────────────────────────────────────────────────
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

    // ── Borrar (inline confirm — igual que CategoryManagerCard) ───────────────
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
                <span
                    aria-label={`${scenarios.length} escenarios`}
                    className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary"
                >
                    {scenarios.length}
                </span>
            </div>

            <p className="text-sm text-muted-foreground -mt-2">
                Crea diferentes escenarios financieros para comparar estrategias. Cada
                escenario tiene sus propios ítems de efectivo independientes.
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

            {/* Input nuevo escenario */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="new-scenario-name" className="sr-only">
                    Nombre del nuevo escenario
                </label>
                <div className="flex items-center gap-2">
                    <input
                        id="new-scenario-name"
                        value={newName}
                        onChange={(e) => {
                            setNewName(e.target.value);
                            setInputError(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        placeholder="Nombre del nuevo escenario…"
                        className={`flex h-10 w-full rounded-3xl border bg-background px-3 py-2 text-sm
                            ring-offset-background placeholder:text-muted-foreground
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1
                            disabled:cursor-not-allowed disabled:opacity-50 text-foreground
                            transition-colors
                            ${inputError ? "border-destructive/60" : "border-primary/20"}`}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newName.trim()}
                        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 transition-colors ${newName.trim()
                                ? "hover:bg-primary/90 cursor-pointer"
                                : "opacity-40 cursor-not-allowed"
                            }`}
                    >
                        <PlusCircle size={16} />
                        Nuevo
                    </button>
                </div>
                {inputError && (
                    <p className="text-xs text-destructive font-medium pl-3">
                        {inputError}
                    </p>
                )}
            </div>
        </div>
    );
};