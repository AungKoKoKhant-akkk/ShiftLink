import { calculateWorkingHours } from "@/lib/shiftCalculator";
import type { Shift } from "@/types/shift";

export const mockShifts: Shift[] = [
    {
        id: 1,
        date: "2026-09-16",
        employee: "Aung Ko Ko Khant",
        type: "Student",
        time: "17:00 – 22:00",
        hours: calculateWorkingHours("17:00", "22:00", 0),
        breakMinutes: 0,
        status: "Scheduled",
    },
    {
        id: 2,
        date: "2026-09-18",
        employee: "Tanaka Yuki",
        type: "Regular",
        time: "10:00 – 18:00",
        hours: calculateWorkingHours("10:00", "18:00", 60),
        breakMinutes: 60,
        status: "Scheduled",
    },
    {
        id: 3,
        date: "2026-09-20",
        employee: "Maria Santos",
        type: "Student",
        time: "16:00 – 22:00",
        hours: calculateWorkingHours("16:00", "22:00", 0),
        breakMinutes: 0,
        status: "Scheduled",
    },
];