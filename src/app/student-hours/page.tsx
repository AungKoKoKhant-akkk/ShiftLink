"use client";

import StatusBadge from "@/components/StatusBadge";
import { isActiveEmployee } from "@/lib/employees";
import { STUDENT_HOUR_LIMIT, STUDENT_HOUR_WARNING } from "@/lib/studentHours";
import PageHeader from "@/components/PageHeader";
import { calculateMaximumRollingSevenDayHours } from "@/lib/shiftCalculator";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";

export default function StudentHoursPage() {
    const { employees, shifts } = useShiftLink();

    const studentHours = employees
        .filter(
            (employee) =>
                employee.type === "Student" && isActiveEmployee(employee)
        )
        .map((employee) => {
            const employeeShifts = shifts.filter(
                (shift) => shift.employee === employee.name
            );

            return {
                id: employee.code,
                name: employee.name,
                employeeCode: employee.code,
                hours: calculateMaximumRollingSevenDayHours(employeeShifts),
            };
        });

    return (
        <>
            <PageHeader
                title="Student Hours"
                description="Monitor student work hours for the 28-hour rule."
            />

            <div className="mt-8 flex flex-col justify-between gap-3 rounded-box bg-base-100 p-4 shadow sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-bold">Current monitoring period</h2>

                    <p className="text-sm text-base-content/60">
                        Rolling 7-day work-hour calculation
                    </p>
                </div>

                <span className="badge badge-primary badge-outline">
                    Limit: {STUDENT_HOUR_LIMIT} hours
                </span>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {studentHours.map((student) => {
                    const percentage = (student.hours / STUDENT_HOUR_LIMIT) * 100;
                    const isOverLimit = student.hours > STUDENT_HOUR_LIMIT;
                    const isNearLimit = student.hours >= STUDENT_HOUR_WARNING && student.hours <= STUDENT_HOUR_LIMIT;

                    return (
                        <div key={student.id} className="card bg-base-100 shadow">
                            <div className="card-body">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="card-title">{student.name}</h2>

                                        <p className="text-sm text-base-content/60">
                                            {student.employeeCode}
                                        </p>
                                    </div>

                                    <StatusBadge status={isOverLimit ? "Over limit" : isNearLimit ? "Near limit" : "Safe"} />
                                </div>

                                <div className="mt-5">
                                    <p className="text-3xl font-bold">
                                        {student.hours}
                                        <span className="text-base font-normal"> / {STUDENT_HOUR_LIMIT} h</span>
                                    </p>

                                    <progress
                                        className={`progress mt-3 w-full ${isOverLimit
                                            ? "progress-error"
                                            : isNearLimit
                                                ? "progress-warning"
                                                : "progress-success"
                                            }`}
                                        value={Math.min(percentage, 100)}
                                        max="100"
                                    />

                                    <p className="mt-2 text-sm text-base-content/60">
                                        {Math.max(STUDENT_HOUR_LIMIT - student.hours, 0).toFixed(1)} hours remaining
                                    </p>

                                </div>

                            </div>

                        </div>

                    );
                })}
            </div>

        </>
    );
}
