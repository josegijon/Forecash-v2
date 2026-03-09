import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { useScenarioStore } from "@/store";
import { AddScenarioModal } from "@/ui/components/modals/AddScenarioModal";

export const SidebarSection = () => {
    const [showAddScenarioModal, setShowAddScenarioModal] = useState(false);

    const navigate = useNavigate();
    const { id: currentRouteId } = useParams();

    const scenarios = useScenarioStore((s) => s.scenarios);

    const handleSelectScenario = (scenarioId: string) => {
        if (scenarioId === currentRouteId) return;
        navigate(`/escenario/${scenarioId}/planificacion`);
    };

    return (
        <div className="pt-6">
            <AddScenarioModal
                isOpen={showAddScenarioModal}
                onClose={() => setShowAddScenarioModal(false)}
            />

            <div className="px-2 mb-3 flex justify-between items-center">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Escenarios
                </p>
                <button
                    onClick={() => setShowAddScenarioModal(true)}
                    className="w-7 h-7 rounded-lg border border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-all flex items-center justify-center hover:scale-105 cursor-pointer"
                    title="Crear nuevo escenario"
                >
                    <Plus size={16} strokeWidth={2.5} />
                </button>
            </div>

            <div className="flex flex-col gap-1">
                {scenarios.map((scenario) => (
                    <button
                        key={scenario.id}
                        onClick={() => handleSelectScenario(scenario.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all truncate cursor-pointer
                            ${scenario.id === currentRouteId
                                ? "bg-primary/20 text-primary border border-primary/20"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                    >
                        <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full transition-all shrink-0
                                ${scenario.id === currentRouteId
                                    ? "bg-primary"
                                    : "bg-border"
                                }`}
                            />
                            <span className="truncate capitalize">{scenario.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};