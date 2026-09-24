import type { Employee } from "@/types/employee";

const API_BASE_URL = "http://localhost:8080";

type ApiEmployee = {
    id: number;
    employeeCode: string;
    name: string;
    type: "STUDENT" | "REGULAR";
    department: string;
    status: "ACTIVE" | "INACTIVE";
};

function toFrontendEmployee(employee: ApiEmployee): Employee {
    return {
        id: employee.id,
        code: employee.employeeCode,
        name: employee.name,
        type: employee.type === "STUDENT" ? "Student" : "Regular",
        department: employee.department,
        status: employee.status === "ACTIVE" ? "Active" : "Inactive",
    };
}

function toApiEmployee(employee: Employee) {
    return {
        employeeCode: employee.code,
        name: employee.name,
        type: employee.type === "Student" ? "STUDENT" : "REGULAR",
        department: employee.department,
        status: employee.status === "Active" ? "ACTIVE" : "INACTIVE",
    };
}

async function getErrorMessage(response: Response) {
    const body = await response.json().catch(() => null);

    return body?.message ?? "Request failed.";
}

export async function getEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE_URL}/api/employees`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const employees: ApiEmployee[] = await response.json();

    return employees.map(toFrontendEmployee);
}

export async function createEmployee(employee: Employee): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(toApiEmployee(employee)),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const createdEmployee: ApiEmployee = await response.json();

    return toFrontendEmployee(createdEmployee);
}

export async function updateEmployee(employee: Employee): Promise<Employee> {
    if (!employee.id) {
        throw new Error("Employee ID is missing.");
    }

    const response = await fetch(
        `${API_BASE_URL}/api/employees/${employee.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(toApiEmployee(employee)),
        }
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const updatedEmployee: ApiEmployee = await response.json();

    return toFrontendEmployee(updatedEmployee);
}

export async function deleteEmployeeFromApi(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }
}