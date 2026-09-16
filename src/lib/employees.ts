import type { Employee } from "@/types/employee";

export function isActiveEmployee(employee: Employee): boolean {
    return employee.status === "Active";
}
