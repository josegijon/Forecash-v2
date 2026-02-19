
interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <main className="flex-1 overflow-auto p-8">
            {children}
        </main>
    )
}
