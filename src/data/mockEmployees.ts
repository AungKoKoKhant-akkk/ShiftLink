import type { Employee } from "@/types/employee";

export const mockEmployees: Employee[] = [
    {
        code: "STU001",
        name: "Aung Ko Ko Khant",
        type: "Student",
        department: "Restaurant Service",
        status: "Active",
    },
    {
        code: "EMP002",
        name: "Tanaka Yuki",
        type: "Regular",
        department: "Front Desk",
        status: "Active",
    },
    {
        code: "STU003",
        name: "Maria Santos",
        type: "Student",
        department: "Kitchen",
        status: "Inactive",
    },
];
// Mock signed-in employee until authentication is introduced.
export const mockCurrentEmployee = mockEmployees[0];
