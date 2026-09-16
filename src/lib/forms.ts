import type { EmployeeFormData } from "@/types/employee";
import type { ShiftFormData } from "@/types/shift";

export function createEmployeeForm(): EmployeeFormData {
    return { code: "", name: "", type: "Student", department: "" };
}

export function createShiftForm(): ShiftFormData {
    return { date: "", employee: "", type: "", startTime: "", endTime: "", breakMinutes: 0 };
}
