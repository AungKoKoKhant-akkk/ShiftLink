import type { UserRole } from "@/types/role";

export type EmployeeType = "Student" | "Regular";
export type EmployeeStatus = "Active" | "Inactive";

export interface Employee {
    id?: number;
    code: string;
    name: string;
    type: EmployeeType;
    department: string;
    status: EmployeeStatus;
    role: UserRole;
}

export type EmployeeFormData = Omit<Employee, "id" | "status"> & { password: string };
