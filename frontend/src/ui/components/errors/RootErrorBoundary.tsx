import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorScreen } from "./ErrorScreen";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export class RootErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        // En producción aquí iría Sentry u otro servicio de logging.
        console.error("[RootErrorBoundary] Error capturado:", {
            message: error.message,
            stack: error.stack,
            componentStack: info.componentStack,
        });
    }

    private handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return <ErrorScreen onReload={this.handleReload} />;
    }
}