import type { EmployeeType } from "@/types/employee";

export type ShiftStatus = "Scheduled" | "Swap Requested" | "Completed";

export interface Shift {
    id: number;
    date: string;
    employee: string;
    type: EmployeeType;
    time: string;
    /** Net working hours, excluding break time. */
    hours: number;
    breakMinutes: number;
    status: ShiftStatus;
}

export type ShiftFormData = {
    date: string;
    employee: string;
    type: EmployeeType | "";
    startTime: string;
    endTime: string;
    breakMinutes: number;
};
