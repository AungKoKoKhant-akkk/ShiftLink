import type { Shift } from "@/types/shift";

export function calculateWorkingHours(
    startTime: string,
    endTime: string,
    breakMinutes: number
): number {
    if (!Number.isFinite(breakMinutes) || breakMinutes < 0) {
        return NaN;
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    let scheduledMinutes = endTotalMinutes - startTotalMinutes;

    if (scheduledMinutes <= 0) {
        scheduledMinutes += 24 * 60;
    }

    const workingMinutes = scheduledMinutes - breakMinutes;

    return workingMinutes / 60;
}

/** Check every seven-calendar-day window containing the proposed shift.
 * Callers supply net hours and omit the old shift when editing. */
export function calculateMaxRollingSevenDayHours(
    shifts: Pick<Shift, "date" | "hours">[],
    newDate: string,
    newHours: number
) {
    const allShifts = [
        ...shifts,
        {
            date: newDate,
            hours: newHours,
        },
    ];

    const targetDate = new Date(`${newDate}T00:00:00`);
    let maximumHours = 0;

    for (let offset = -6; offset <= 0; offset++) {
        const windowStart = new Date(targetDate);
        windowStart.setDate(targetDate.getDate() + offset);

        const windowEnd = new Date(windowStart);
        windowEnd.setDate(windowStart.getDate() + 6);

        const totalHours = allShifts
            .filter((shift) => {
                const shiftDate = new Date(`${shift.date}T00:00:00`);

                return shiftDate >= windowStart && shiftDate <= windowEnd;
            })
            .reduce((total, shift) => total + shift.hours, 0);

        maximumHours = Math.max(maximumHours, totalHours);
    }

    return maximumHours;
}

export function calculateMaximumRollingSevenDayHours(
    shifts: Pick<Shift, "date" | "hours">[]
) {
    if (shifts.length === 0) {
        return 0;
    }

    return Math.max(
        ...shifts.map((shift, index) => {
            const otherShifts = shifts.filter(
                (_, currentIndex) => currentIndex !== index
            );

            return calculateMaxRollingSevenDayHours(
                otherShifts,
                shift.date,
                shift.hours
            );
        })
    );
}