# Rutas

## Estructura de URLs

```
/                                          → redirect → /escenario/scenario-1/planificacion
/escenario/:id/planificacion               → PlanningPage
/escenario/:id/simulaciones                → SimulationPage
/escenario/:id/proyeccion                  → ProjectionPage
/escenario/:id/datos                       → DataPage
*                                          → redirect → /escenario/scenario-1/planificacion
```

El escenario activo forma parte de la URL. Navegar a `/escenario/abc-123/proyeccion` carga la proyección del escenario `abc-123` directamente, sin pasos intermedios.

---

## Por qué el escenario vive en la URL

La alternativa habitual es guardar el escenario activo solo en el store (`activeScenarioId`). Funciona, pero tiene limitaciones:

- El usuario no puede hacer bookmark de "estoy viendo el escenario B en proyección".
- Al recargar la página, la app siempre vuelve al escenario por defecto.
- Compartir una vista concreta es imposible.

Con el escenario en la URL, la vista completa (qué escenario, qué pantalla) es una dirección navegable. El estado de la URL es la fuente de verdad para "qué estoy mirando ahora".

---

## `ScenarioLayout`

El layout intermedio que sincroniza la URL con el store:

```typescript
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
```

Cuando el `id` de la URL no coincide con el `activeScenarioId` del store (por ejemplo, al navegar directamente a una URL con un escenario distinto), `ScenarioLayout` sincroniza el store. Si el `id` no existe en el store, `setActiveScenario` lo ignora y el escenario activo no cambia.

---

## Lazy loading

Cada página se importa con `React.lazy`:

```typescript
const PlanningPage = lazy(() =>
    import("@/pages/PlanningPage").then((m) => ({ default: m.PlanningPage }))
);
```

Vite genera un chunk JavaScript independiente por página. El navegador solo descarga el código de una página cuando el usuario navega a ella por primera vez. El bundle inicial es más pequeño y la carga inicial más rápida.

El `Suspense` en `ScenarioLayout` muestra un spinner mientras se descarga el chunk. El fallback es deliberadamente minimalista — un spinner de opacidad reducida — para no generar un flash visual agresivo en navegaciones rápidas.

---

## Redirects y casos borde

- `/` redirige a `/escenario/scenario-1/planificacion`. `scenario-1` es el id del escenario por defecto que se crea en el primer uso.
- Cualquier ruta no reconocida (`*`) también redirige al mismo destino. No hay página 404.
- `/escenario/:id` sin subruta redirige a `planificacion` mediante un `index` route.

El `vercel.json` redirige todas las rutas al `index.html` para que React Router gestione la navegación en cliente:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Sin esta configuración, una recarga en `/escenario/abc/proyeccion` devolvería un 404 del servidor.