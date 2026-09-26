"use client"
import {STUDENT_HOUR_LIMIT, STUDENT_HOUR_WARNING} from "@/lib/studentHours";
import PageHeader from "@/components/PageHeader";
import { Plus } from "lucide-react";
import ShiftCalendar from "@/components/ShiftCalendar";
import {calculateMaximumRollingSevenDayHours} from "@/lib/shiftCalculator";
import {isActiveEmployee} from "@/lib/employees";
import {useShiftLink} from "@/components/providers/ShiftLinkProvider";
import Link from "next/link";
import {useLanguage} from "@/components/providers/LanguageProvider";
export default function Home() {
    const { employees, shifts, swapRequests } = useShiftLink();
    const { t } = useLanguage();

    const activeEmployees = employees.filter(isActiveEmployee);
    const studentEmployees = activeEmployees.filter(
        (employee) => employee.type === "Student"
    );

    const studentHourAlerts = studentEmployees
        .map((student) => {
            const studentShifts = shifts.filter(
                (shift) => shift.employee === student.name
            );

            const hours = calculateMaximumRollingSevenDayHours(studentShifts);

            return {
                student,
                hours,
                remainingHours: Math.max(STUDENT_HOUR_LIMIT - hours, 0),
            };
        })
        .filter((item) => item.hours >= STUDENT_HOUR_WARNING)
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 3);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonthShifts = shifts.filter((shift) =>
        shift.date.startsWith(currentMonth)
    );

    const openSwapRequests = swapRequests.filter(
        (request) => request.status === "Pending"
    );

    const stats = [
        {
            title: t("totalEmployees"),
            value: activeEmployees.length,
            description: t("activeEmployees"),
            color: "text-primary",
        },
        {
            title: t("studentEmployees"),
            value: studentEmployees.length,
            description: t("trackingEnabled"),
            color: "text-info",
        },
        {
            title: t("thisMonthShifts"),
            value: thisMonthShifts.length,
            description: currentMonth,
            color: "text-secondary",
        },
        {
            title: t("openSwapRequests"),
            value: openSwapRequests.length,
            description: t("approvalNeeded"),
            color: "text-warning",
        },
    ];

    return (
        <>
            <PageHeader
                title={t("dashboard")}
                description={t("welcome")}
                action={
                    <button className="btn btn-primary">
                        <Plus size={18} />
                        {t("addShift")}
                    </button>
                }
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.title} className="stats bg-base-100 shadow">
                        <div className="stat">
                            <div className="stat-title">{stat.title}</div>
                            <div className={`stat-value ${stat.color}`}>
                                {stat.value}
                            </div>
                            <div className="stat-desc">{stat.description}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid items-start gap-6 xl:grid-cols-3">
                <section className="card bg-base-100 shadow xl:col-span-2">
                    <div className="card-body">
                        <h2 className="card-title">{t("shiftOverview")}</h2>
                        <ShiftCalendar />
                    </div>
                </section>

                <aside className="card bg-base-100 shadow">
                    <div className="rounded-box bg-base-100 p-6 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">{t("studentHoursAlerts")}</h2>
                                <p className="mt-1 text-sm text-base-content/60">
                                    {t("studentsNearLimit")}
                                </p>
                            </div>

                            <span className="badge badge-outline">
      {studentHourAlerts.length}
    </span>
                        </div>

                        {studentHourAlerts.length === 0 ? (
                            <p className="mt-6 text-sm text-base-content/60">
                                {t("noStudentsNearLimit")}
                            </p>
                        ) : (
                            <div className="mt-5 space-y-4">
                                {studentHourAlerts.map(({ student, hours, remainingHours }) => {
                                    const isOverLimit = hours >= STUDENT_HOUR_LIMIT;

                                    return (
                                        <div key={student.id ?? student.code}>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold">{student.name}</p>
                                                    <p className="text-xs text-base-content/60">
                                                        {student.code}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`badge ${
                                                        isOverLimit ? "badge-error" : "badge-warning"
                                                    }`}
                                                >
                                                    {hours} / {STUDENT_HOUR_LIMIT} h
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-base-content/60">
                                                {isOverLimit
                                                    ? t("weeklyLimitExceeded")
                                                    : t("hoursRemaining", { hours: remainingHours.toFixed(1) })}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <Link
                            href="/student-hours"
                            className="btn btn-outline btn-primary btn-sm mt-6 w-full"
                        >
                            {t("viewAllStudentHours")}
                        </Link>
                    </div>
                </aside>
            </div>
        </>
    );
}
