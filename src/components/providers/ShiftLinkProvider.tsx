"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Employee, EmployeeFormData } from "@/types/employee";
import type { Shift } from "@/types/shift";
import type { SwapRequest } from "@/types/swapRequest";
import type { UserRole } from "@/types/role";
import { createEmployee, deleteEmployeeFromApi, getEmployees, updateEmployee } from "@/lib/api/employees";
import { createShift, deleteShiftFromApi, getMyShifts, getShifts, updateShift } from "@/lib/api/shifts";
import { createSwapRequest, getMySwapRequests, getSwapRequests, updateSwapRequestStatus } from "@/lib/api/swapRequests";
import { getCurrentUser, login as loginWithApi, logout as logoutWithApi, type LoggedInUser } from "@/lib/api/auth";

const managerRoles: UserRole[] = ["Admin", "Manager"];

type ShiftLinkContextValue = {
    employees: Employee[];
    shifts: Shift[];
    swapRequests: SwapRequest[];
    currentUser: LoggedInUser | null;
    currentRole: UserRole;
    isLoadingAuth: boolean;
    isLoadingShifts: boolean;
    isLoadingSwapRequests: boolean;
    login: (employeeCode: string, password: string) => Promise<LoggedInUser>;
    logout: () => Promise<void>;
    saveEmployee: (employee: EmployeeFormData, previousCode?: string) => Promise<void>;
    deleteEmployee: (code: string) => Promise<void>;
    saveShift: (shift: Omit<Shift, "id" | "status">, id?: number) => Promise<void>;
    deleteShift: (id: number) => Promise<void>;
    requestSwap: (shiftId: number, reason: string) => Promise<void>;
    updateSwapRequest: (id: number, changes: Partial<Pick<SwapRequest, "replacementEmployeeId" | "replacementEmployee" | "status">>) => Promise<void>;
};

const ShiftLinkContext = createContext<ShiftLinkContextValue | null>(null);

export function ShiftLinkProvider({ children }: { children: ReactNode }) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
    const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isLoadingShifts, setIsLoadingShifts] = useState(false);
    const [isLoadingSwapRequests, setIsLoadingSwapRequests] = useState(false);
    const currentRole = currentUser?.role ?? "User";

    const clearProtectedState = useCallback(() => {
        setEmployees([]);
        setShifts([]);
        setSwapRequests([]);
    }, []);

    useEffect(() => {
        let active = true;
        void getCurrentUser()
            .then((user) => { if (active) setCurrentUser(user); })
            .catch(() => { if (active) clearProtectedState(); })
            .finally(() => { if (active) setIsLoadingAuth(false); });
        return () => { active = false; };
    }, [clearProtectedState]);

    useEffect(() => {
        if (isLoadingAuth || !currentUser || !currentRole) return;
        let active = true;
        void (async () => {
            try {
                const [loadedShifts, loadedRequests] = await Promise.all([
                    currentRole === "User" ? getMyShifts() : getShifts(),
                    currentRole === "User" ? getMySwapRequests() : getSwapRequests(),
                ]);
                if (active) { setShifts(loadedShifts); setSwapRequests(loadedRequests); }
            } finally {
                if (active) { setIsLoadingShifts(false); setIsLoadingSwapRequests(false); }
            }
        })();
        return () => { active = false; };
    }, [currentRole, currentUser, isLoadingAuth]);

    useEffect(() => {
        if (isLoadingAuth || !currentUser || !currentRole) return;
        if (!managerRoles.includes(currentRole)) return;
        let active = true;
        void getEmployees().then((items) => { if (active) setEmployees(items); }).catch(() => { if (active) setEmployees([]); });
        return () => { active = false; };
    }, [currentRole, currentUser, isLoadingAuth]);

    useEffect(() => {
        if (isLoadingAuth || !currentUser) return;

        let active = true;
        const refreshSwapRequests = async () => {
            try {
                const requests = currentRole === "User"
                    ? await getMySwapRequests()
                    : await getSwapRequests();
                if (active) setSwapRequests(requests);
            } catch {
                // Keep the last successful result while a background refresh fails.
            }
        };

        const refreshWhenVisible = () => {
            if (document.visibilityState === "visible") void refreshSwapRequests();
        };

        const intervalId = window.setInterval(refreshSwapRequests, 10_000);
        document.addEventListener("visibilitychange", refreshWhenVisible);

        return () => {
            active = false;
            window.clearInterval(intervalId);
            document.removeEventListener("visibilitychange", refreshWhenVisible);
        };
    }, [currentRole, currentUser, isLoadingAuth]);
    const login = useCallback(async (employeeCode: string, password: string) => {
        const user = await loginWithApi(employeeCode, password);
        clearProtectedState();
        setCurrentUser(user);
        return user;
    }, [clearProtectedState]);

    const logout = useCallback(async () => {
        try { await logoutWithApi(); } finally { clearProtectedState(); setCurrentUser(null); }
    }, [clearProtectedState]);

    const value = useMemo<ShiftLinkContextValue>(() => ({
        employees, shifts, swapRequests, currentUser, currentRole, isLoadingAuth, isLoadingShifts, isLoadingSwapRequests, login, logout,
        async saveEmployee(employee, previousCode) {
            const existing = previousCode ? employees.find((item) => item.code === previousCode) : undefined;
            const saved = existing ? await updateEmployee({ ...employee, id: existing.id, status: existing.status }) : await createEmployee({ ...employee, status: "Active" });
            setEmployees((items) => existing ? items.map((item) => item.id === saved.id ? saved : item) : [...items, saved]);
        },
        async deleteEmployee(code) {
            const employee = employees.find((item) => item.code === code);
            if (!employee?.id) throw new Error("Employee ID is missing.");
            await deleteEmployeeFromApi(employee.id);
            setEmployees((items) => items.filter((item) => item.id !== employee.id));
        },
        async saveShift(shift, id) {
            const employee = employees.find((item) => item.name.trim() === shift.employee.trim());
            if (!employee?.id) throw new Error("Selected employee was not found.");
            const saved = id ? await updateShift({ ...shift, id }, employee.id) : await createShift(shift, employee.id);
            setShifts((items) => id ? items.map((item) => item.id === id ? saved : item) : [...items, saved]);
        },
        async deleteShift(id) {
            await deleteShiftFromApi(id);
            setShifts((items) => items.filter((item) => item.id !== id));
        },
        async requestSwap(shiftId, reason) {
            const request = await createSwapRequest(shiftId, reason);
            setSwapRequests((items) => [request, ...items]);
            setShifts((items) => items.map((shift) => shift.id === shiftId ? { ...shift, status: "Swap Requested" } : shift));
        },
        async updateSwapRequest(id, changes) {
            if (!changes.status || changes.status === "Pending") throw new Error("Select Approved or Rejected.");
            const request = swapRequests.find((item) => item.id === id);
            const saved = await updateSwapRequestStatus(id, changes.status, changes.replacementEmployeeId ?? request?.replacementEmployeeId);
            setSwapRequests((items) => items.map((item) => item.id === id ? saved : item));
        },
    }), [currentRole, currentUser, employees, isLoadingAuth, isLoadingShifts, isLoadingSwapRequests, login, logout, shifts, swapRequests]);

    return <ShiftLinkContext.Provider value={value}>{children}</ShiftLinkContext.Provider>;
}

export function useShiftLink() {
    const context = useContext(ShiftLinkContext);
    if (!context) throw new Error("useShiftLink must be used inside ShiftLinkProvider");
    return context;
}