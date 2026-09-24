import type { Employee } from "@/types/employee";

export function isActiveEmployee(employee: Employee): boolean {
    return employee.status === "Active";
}

export function isAssignableEmployee(employee: Employee): boolean {
    return isActiveEmployee(employee) && employee.role !== "Admin";
}