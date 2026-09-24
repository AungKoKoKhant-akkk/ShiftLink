"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";

export default function AuthGuard({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser, isLoadingAuth } = useShiftLink();

    const isLoginPage = pathname === "/login";

    useEffect(() => {
        if (isLoadingAuth) {
            return;
        }

        if (!currentUser && !isLoginPage) {
            router.replace("/login");
        }

        if (currentUser && isLoginPage) {
            router.replace("/");
        }
    }, [currentUser, isLoadingAuth, isLoginPage, router]);

    if (isLoadingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if ((!currentUser && !isLoginPage) || (currentUser && isLoginPage)) {
        return null;
    }

    return <>{children}</>;
}