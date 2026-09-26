import { getApiBaseUrl } from "@/lib/api/config";
import type { Employee } from "@/types/employee";

const API_BASE_URL = getApiBaseUrl();

type ApiEmployee = {
    id: number;
    employeeCode: string;
    name: string;
    type: "STUDENT" | "REGULAR";
    department: string;
    status: "ACTIVE" | "INACTIVE";
    role: "ADMIN" | "MANAGER" | "USER";
};

function toFrontendEmployee(employee: ApiEmployee): Employee {
    return {
        id: employee.id,
        code: employee.employeeCode,
        name: employee.name,
        type: employee.type === "STUDENT" ? "Student" : "Regular",
        department: employee.department,
        status: employee.status === "ACTIVE" ? "Active" : "Inactive",
        role: employee.role === "ADMIN" ? "Admin" : employee.role === "MANAGER" ? "Manager" : "User",
    };
}

function toApiEmployee(employee: Employee & { password?: string }) {
    return {
        employeeCode: employee.code,
        name: employee.name,
        type: employee.type === "Student" ? "STUDENT" : "REGULAR",
        department: employee.department,
        status: employee.status === "Active" ? "ACTIVE" : "INACTIVE",
        role: employee.role.toUpperCase(),
        ...(employee.password?.trim() ? { password: employee.password } : {}),
    };
}

async function getErrorMessage(response: Response) {
    const body = await response.json().catch(() => null);
    return body?.message ?? "Request failed.";
}

export async function getEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE_URL}/api/employees`, { cache: "no-store", credentials: "include" });
    if (!response.ok) throw new Error(await getErrorMessage(response));
    return (await response.json() as ApiEmployee[]).map(toFrontendEmployee);
}

export async function createEmployee(employee: Employee & { password?: string }): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/api/employees`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toApiEmployee(employee)) });
    if (!response.ok) throw new Error(await getErrorMessage(response));
    return toFrontendEmployee(await response.json());
}

export async function updateEmployee(employee: Employee & { password?: string }): Promise<Employee> {
    if (!employee.id) throw new Error("Employee ID is missing.");
    const response = await fetch(`${API_BASE_URL}/api/employees/${employee.id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toApiEmployee(employee)) });
    if (!response.ok) throw new Error(await getErrorMessage(response));
    return toFrontendEmployee(await response.json());
}

export async function deleteEmployeeFromApi(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, { method: "DELETE", credentials: "include" });
    if (!response.ok) throw new Error(await getErrorMessage(response));
}