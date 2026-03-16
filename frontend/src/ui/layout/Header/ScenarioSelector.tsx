import { useState } from "react";
import { useNavigate } from "react-router";
import { useActiveScenario, useScenarioStore } from "@/store";
import { ChevronDown, Plus } from "lucide-react";
import { AddScenarioModal } from "@/ui/components/modals/AddScenarioModal";

export const ScenarioSelector = () => {
    const [open, setOpen] = useState(false);
    const [showAddScenarioModal, setShowAddScenarioModal] = useState(false);

    const scenarios = useScenarioStore((s) => s.scenarios);
    const active = useActiveScenario();
    const navigate = useNavigate();

    return (
        <div className="relative">
            <AddScenarioModal
                isOpen={showAddScenarioModal}
                onClose={() => setShowAddScenarioModal(false)}
            />

            <button
                onClick={() => setOpen(!open)}
                onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-border
                           bg-card hover:bg-accent text-sm font-medium transition-colors cursor-pointer"
            >
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="capitalize">{active?.name}</span>
                <ChevronDown size={14} className="transition-transform group-focus-within:rotate-180" />
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-30 min-h-screen"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 sm:left-0 mt-2 w-56 rounded-lg border border-border
                                bg-card shadow-lg py-1 z-50">
                        {scenarios.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    navigate(`/escenario/${s.id}/planificacion`);
                                    setOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-accent cursor-pointer
                                ${s.id === active?.id ? "text-primary font-semibold" : "text-foreground"}`}
                            >
                                {s.name}
                            </button>
                        ))}

                        <div className="border-t border-border mt-1 pt-1">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setShowAddScenarioModal(true);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-accent cursor-pointer"
                            >
                                <Plus size={14} className="inline mr-2" />
                                Nuevo escenario
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};