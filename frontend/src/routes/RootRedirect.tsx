import { Navigate } from "react-router";
import { useCashflowStore, useScenarioStore } from "@/store";

export const RootRedirect = () => {
    const { items } = useCashflowStore.getState();
    const { activeScenarioId } = useScenarioStore.getState();

    const hasData = Object.values(items).some(arr => arr.length > 0);

    if (hasData) {
        return <Navigate to={`/escenario/${activeScenarioId}/planificacion`} replace />;
    }

    return <Navigate to="/landing" replace />;
};
