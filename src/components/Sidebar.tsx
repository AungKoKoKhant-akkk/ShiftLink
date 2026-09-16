"use client";

import {
    ArrowLeftRight,
    BarChart3,
    CalendarDays,
    ClipboardList,
    LayoutDashboard,
    UserRound,
    Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employees", label: "Employees", icon: Users },
    { href: "/shift-calendar", label: "Shift Calendar", icon: CalendarDays },
    { href: "/shift-management", label: "Shift Management", icon: ClipboardList },
    { href: "/my-schedule", label: "My Schedule", icon: UserRound },
    { href: "/student-hours", label: "Student Hours", icon: BarChart3 },
    { href: "/swap-requests", label: "Swap Requests", icon: ArrowLeftRight },
];

export default function Sidebar() {
    const pathname = usePathname();

    function navClass(href: string) {
        return `btn w-full justify-start ${pathname === href ? "btn-primary" : "btn-ghost text-white"
            }`;
    }
    return (
        <aside className="min-h-screen w-64 bg-[#0b1f3a] p-4 text-white">
            <div className="flex items-center gap-2 px-3 py-4">
                <CalendarDays className="text-primary" size={30} />
                <span className="text-2xl font-bold">ShiftLink</span>
            </div>

            <nav className="mt-8 space-y-2">
                {navigationItems.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} className={navClass(href)}>
                        <Icon size={20} />
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    )
}
