"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types/role";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";

type RoleGuardProps = { allowedRoles: UserRole[]; children: ReactNode };

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
    const router = useRouter();
    const { currentRole, isLoadingAuth } = useShiftLink();
    const allowed = allowedRoles.includes(currentRole);

    useEffect(() => {
        if (!isLoadingAuth && !allowed) router.replace("/");
    }, [allowed, isLoadingAuth, router]);

    if (isLoadingAuth || !allowed) return null;
    return <>{children}</>;
}