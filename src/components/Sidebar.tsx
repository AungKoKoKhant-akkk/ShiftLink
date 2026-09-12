"use client"
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
import {usePathname} from "next/navigation";

export default function Sidebar(){
    const pathname = usePathname();

    function navClass(href: string) {
        return `btn w-full justify-start ${
            pathname === href ? "btn-primary" : "btn-ghost text-white"
        }`;
    }
    return(
        <aside className="min-h-screen w-64 bg-[#0b1f3a] p-4 text-white">
            <div className="flex items-center gap-2 px-3 py-4">
                <CalendarDays className="text-primary" size={30} />
                <span className="text-2xl font-bold">ShiftLink</span>
            </div>

            <nav className="mt-8 space-y-2">
                <Link href="/" className={navClass("/")}>
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>

                <Link href="/employees" className={navClass("/employees")}>
                    <Users size={20} />
                    Employees
                </Link>

                <Link href="/shift-calendar" className={navClass("/shift-calendar")}>
                    <CalendarDays size={20} />
                    Shift Calendar
                </Link>

                <Link href="/shift-management" className={navClass("/shift-management")}>
                    <ClipboardList size={20} />
                    Shift Management
                </Link>

                <Link href="/my-schedule" className={navClass("/my-schedule")}>
                    <UserRound size={20} />
                    My Schedule
                </Link>

                <Link href="/student-hours" className={navClass("/student-hours")}>
                    <BarChart3 size={20} />
                    Student Hours
                </Link>

                <Link href="/swap-requests" className={navClass("/swap-requests")}>
                    <ArrowLeftRight size={20} />
                    Swap Requests
                </Link>
            </nav>
        </aside>
    )
}
