export type EmployeeType = "Student" | "Regular";

export type EmployeeStatus = "Active" | "Inactive";

export interface Employee {
    code: string;
    name: string;
    type: EmployeeType;
    department: string;
    status: EmployeeStatus;
}

export type EmployeeFormData = Omit<Employee, "status">;
