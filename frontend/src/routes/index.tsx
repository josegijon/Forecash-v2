import { DataPage } from "@/pages/DataPage"
import { PlanningPage } from "@/pages/PlanningPage"
import { ProjectionPage } from "@/pages/ProjectionPage"
import { SimulationPage } from "@/pages/SimulationPage"
import { MainLayout } from "@/ui/layout/MainLayout"
import { createBrowserRouter, Navigate, Outlet } from "react-router"

const ScenarioLayout = () => {
    return (
        <>
            <MainLayout>
                <Outlet />
            </MainLayout>
        </>
    )
};

export const router = createBrowserRouter([
    {
        // Esta ruta muestra la page planificación con el primer escenario de la lista (aun no hay una lista de escenarios, asi que se asume el id 1)
        // TODO: Hacer cuando haya una lista de escenarios, mostrar la planificación del primer escenario de la lista
        path: "/",
        element: <Navigate to="/escenario/1/planificacion" replace />
    },
    {
        path: "/escenario/:id",
        element: <ScenarioLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="planificacion" replace />
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
        // Cualquier ruta que no exista
        path: "*",
        element: <Navigate to="/escenario/1/planificacion" replace />
    }
])