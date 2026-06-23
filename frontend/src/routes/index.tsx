import { lazy, Suspense, useEffect } from "react"
import { createBrowserRouter, Navigate, Outlet, useParams } from "react-router"
import { MainLayout } from "@/ui/layout/MainLayout"
import { useScenarioStore } from "@/store"
import { ErrorScreen } from "@/ui/components/errors/ErrorScreen"
import { RootRedirect } from "./RootRedirect"
import { LandingPage } from "@/pages/LandingPage"

const PlanningPage = lazy(() =>
    import("@/pages/PlanningPage").then((m) => ({ default: m.PlanningPage }))
);
const SimulationPage = lazy(() =>
    import("@/pages/SimulationPage").then((m) => ({ default: m.SimulationPage }))
);
const ProjectionPage = lazy(() =>
    import("@/pages/ProjectionPage").then((m) => ({ default: m.ProjectionPage }))
);
const DataPage = lazy(() =>
    import("@/pages/DataPage").then((m) => ({ default: m.DataPage }))
);

const PageLoader = () => (
    <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent opacity-40" />
    </div>
)

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
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </MainLayout>
    );
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootRedirect />
    },
    {
        path: "/escenario/:id",
        element: <ScenarioLayout />,
        errorElement: <ErrorScreen />,
        children: [
            { index: true, element: <Navigate to="planificacion" replace /> },
            { path: "planificacion", element: <PlanningPage /> },
            { path: "simulaciones", element: <SimulationPage /> },
            { path: "proyeccion", element: <ProjectionPage /> },
            { path: "datos", element: <DataPage /> },
        ]
    },
    {
        path: "/landing",
        element: <LandingPage />
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);
