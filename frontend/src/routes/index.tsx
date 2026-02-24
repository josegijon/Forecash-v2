import { useEffect } from "react"
import { DataPage } from "@/pages/DataPage"
import { PlanningPage } from "@/pages/PlanningPage"
import { ProjectionPage } from "@/pages/ProjectionPage"
import { SimulationPage } from "@/pages/SimulationPage"
import { MainLayout } from "@/ui/layout/MainLayout"
import { useScenarioStore } from "@/store"
import { createBrowserRouter, Navigate, Outlet, useParams } from "react-router"

const ScenarioLayout = () => {
    const { id } = useParams();
    const setActiveScenario = useScenarioStore((s) => s.setActiveScenario);
    const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);

    useEffect(() => {
        if (id && id !== activeScenarioId) {
            setActiveScenario(id);
        }
    }, [id, activeScenarioId, setActiveScenario]);

    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/escenario/scenario-1/planificacion" replace />
    },
    {
        path: "/escenario/:id",
        element: <ScenarioLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="planificacion" replace />  // ← relativa, respeta el :id
            },
            {
                path: "planificacion",
                element: <PlanningPage />
            },
            {
                path: "simulaciones",
                element: <SimulationPage />
            },
            {
                path: "proyeccion",
                element: <ProjectionPage />
            },
            {
                path: "datos",
                element: <DataPage />
            },
        ]
    },
    {
        path: "*",
        element: <Navigate to="/escenario/scenario-1/planificacion" replace />
    }
])