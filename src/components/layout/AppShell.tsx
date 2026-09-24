"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

type AppShellProps = {
    children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();

    return (
        <AuthGuard>
            {pathname === "/login" ? (
                children
            ) : (
                <div className="min-h-screen bg-base-200 md:flex">
                    <Sidebar />

                    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            )}
        </AuthGuard>
    );
}