import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

type AppShellProps = {
    children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
    return (
        <div className="flex min-h-screen bg-base-200">
            <Sidebar />

            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}