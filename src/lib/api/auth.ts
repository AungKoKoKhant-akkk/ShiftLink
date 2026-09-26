import { getApiBaseUrl } from "@/lib/api/config";
import type { UserRole } from "@/types/role";

const API_BASE_URL = getApiBaseUrl();

type BackendUserRole = "ADMIN" | "MANAGER" | "USER";

type LoginResponseDto = {
    employeeId: number;
    employeeCode: string;
    name: string;
    role: BackendUserRole;
};

export type LoggedInUser = {
    employeeId: number;
    employeeCode: string;
    name: string;
    role: UserRole;
};

function toFrontendRole(role: BackendUserRole): UserRole {
    const roleMap: Record<BackendUserRole, UserRole> = {
        ADMIN: "Admin",
        MANAGER: "Manager",
        USER: "User",
    };

    return roleMap[role];
}

function toLoggedInUser(data: LoginResponseDto): LoggedInUser {
    return {
        employeeId: data.employeeId,
        employeeCode: data.employeeCode,
        name: data.name,
        role: toFrontendRole(data.role),
    };
}

export async function login(
    employeeCode: string,
    password: string
): Promise<LoggedInUser> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            employeeCode,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Invalid employee code or password.");
    }

    return toLoggedInUser(await response.json());
}

export async function getCurrentUser(): Promise<LoggedInUser> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("You are not logged in.");
    }

    return toLoggedInUser(await response.json());
}

export async function logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
}