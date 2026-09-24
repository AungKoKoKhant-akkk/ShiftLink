import type { Employee } from "@/types/employee";

export const mockEmployees: Employee[] = [
    { code: "STU001", name: "Aung Ko Ko Khant", type: "Student", department: "Restaurant Service", status: "Active", role: "User" },
    { code: "EMP002", name: "Tanaka Yuki", type: "Regular", department: "Front Desk", status: "Active", role: "Manager" },
    { code: "STU003", name: "Maria Santos", type: "Student", department: "Kitchen", status: "Inactive", role: "User" },
];

export const mockCurrentEmployee = mockEmployees[0];
