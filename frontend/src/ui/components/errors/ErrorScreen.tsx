// Pantalla de error reutilizable.
// Usada tanto por RootErrorBoundary (errores fuera del router)
// como por el errorElement de React Router (errores dentro de rutas).

interface ErrorScreenProps {
    onReload?: () => void;
}

const handleReload = () => window.location.reload();

export const ErrorScreen = ({ onReload = handleReload }: ErrorScreenProps) => (
    <div
        style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "hsl(var(--background))",
            padding: "2rem",
        }}
    >
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
                maxWidth: "400px",
                width: "100%",
                textAlign: "center",
            }}
        >
            {/* Icono */}
            <div
                style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "hsl(var(--badge-danger-bg))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
                aria-hidden="true"
            >
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="hsl(var(--badge-danger-fg))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                </svg>
            </div>

            {/* Texto */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <h1
                    style={{
                        margin: 0,
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        fontFamily: "var(--font-poppins, sans-serif)",
                        color: "hsl(var(--foreground))",
                        lineHeight: 1.3,
                    }}
                >
                    Algo ha salido mal
                </h1>
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))",
                        fontFamily: "var(--font-poppins, sans-serif)",
                        lineHeight: 1.6,
                    }}
                >
                    La aplicación ha encontrado un error inesperado.
                    Tus datos están a salvo en el navegador.
                </p>
            </div>

            {/* Acción */}
            <button
                onClick={onReload}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "var(--radius, 0.5rem)",
                    border: "none",
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: "var(--font-poppins, sans-serif)",
                    cursor: "pointer",
                    transition: "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                </svg>
                Recargar aplicación
            </button>
        </div>
    </div>
);