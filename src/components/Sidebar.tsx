"use client";

import {
    ArrowLeftRight,
    BarChart3,
    CalendarDays,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    UserRound,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { UserRole } from "@/types/role";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";

const navigationItems: {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    roles: UserRole[];
}[] = [
    {
        href: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
        roles: ["Admin", "Manager", "User"],
    },
    {
        href: "/employees",
        label: "Employees",
        icon: Users,
        roles: ["Admin"],
    },
    {
        href: "/shift-calendar",
        label: "Shift Calendar",
        icon: CalendarDays,
        roles: ["Admin", "Manager"],
    },
    {
        href: "/shift-management",
        label: "Shift Management",
        icon: ClipboardList,
        roles: ["Admin", "Manager"],
    },
    {
        href: "/my-schedule",
        label: "My Schedule",
        icon: UserRound,
        roles: ["Admin", "Manager", "User"],
    },
    {
        href: "/student-hours",
        label: "Student Hours",
        icon: BarChart3,
        roles: ["Admin", "Manager"],
    },
    {
        href: "/swap-requests",
        label: "Swap Requests",
        icon: ArrowLeftRight,
        roles: ["Admin", "Manager"],
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentRole, currentUser, logout } = useShiftLink();

    const visibleNavigationItems = navigationItems.filter((item) =>
        item.roles.includes(currentRole)
    );

    function navClass(href: string) {
        return `btn w-full justify-start ${
            pathname === href ? "btn-primary" : "btn-ghost text-white"
        }`;
    }

    async function handleLogout() {
        await logout();
        router.replace("/login");
    }

    return (
        <>
            <header className="sticky top-0 z-20 bg-[#0b1f3a] px-4 py-3 text-white shadow md:hidden">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <CalendarDays className="shrink-0 text-primary" size={28} />
                        <span className="truncate text-xl font-bold">ShiftLink</span>
                    </div>

                    <button
                        className="btn btn-ghost btn-sm text-white"
                        type="button"
                        onClick={() => void handleLogout()}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {visibleNavigationItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`btn btn-sm shrink-0 ${
                                pathname === href
                                    ? "btn-primary"
                                    : "btn-ghost text-white"
                            }`}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    ))}
                </nav>
            </header>

            <aside className="sticky top-0 hidden min-h-screen w-64 shrink-0 flex-col bg-[#0b1f3a] p-4 text-white md:flex">
                <div className="flex items-center gap-2 px-3 py-4">
                    <CalendarDays className="text-primary" size={30} />
                    <span className="text-2xl font-bold">ShiftLink</span>
                </div>

                <nav className="mt-8 space-y-2">
                    {visibleNavigationItems.map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href} className={navClass(href)}>
                            <Icon size={20} />
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto border-t border-white/15 pt-4">
                    <p className="truncate font-medium">
                        {currentUser?.name ?? "Signed-in user"}
                    </p>
                    <p className="mb-3 text-xs uppercase tracking-wide text-white/60">
                        {currentRole}
                    </p>

                    <button
                        className="btn btn-outline btn-sm w-full border-white/30 text-white hover:border-white hover:bg-white hover:text-[#0b1f3a]"
                        type="button"
                        onClick={() => void handleLogout()}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}