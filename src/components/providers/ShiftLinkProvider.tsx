"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { mockEmployees, mockCurrentEmployee } from "@/data/mockEmployees";
import { mockShifts } from "@/data/mockShifts";
import { mockSwapRequests } from "@/data/mockSwapRequests";
import type { Employee, EmployeeFormData } from "@/types/employee";
import type { Shift } from "@/types/shift";
import type { SwapRequest } from "@/types/swapRequest";

type ShiftLinkContextValue = {
    employees: Employee[];
    shifts: Shift[];
    swapRequests: SwapRequest[];
    currentEmployee: Employee;
    saveEmployee: (employee: EmployeeFormData, previousCode?: string) => void;
    deleteEmployee: (code: string) => void;
    saveShift: (shift: Omit<Shift, "id" | "status">, id?: number) => void;
    deleteShift: (id: number) => void;
    requestSwap: (shiftId: number, reason: string) => void;
    updateSwapRequest: (id: number, changes: Partial<Pick<SwapRequest, "replacementEmployee" | "status">>) => void;
};

const ShiftLinkContext = createContext<ShiftLinkContextValue | null>(null);

export function ShiftLinkProvider({ children }: { children: ReactNode }) {
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [shifts, setShifts] = useState<Shift[]>(mockShifts);
    const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(mockSwapRequests);

    const value = useMemo<ShiftLinkContextValue>(() => ({
        employees,
        shifts,
        swapRequests,
        currentEmployee: employees.find((employee) => employee.code === mockCurrentEmployee.code) ?? mockCurrentEmployee,
        saveEmployee(employee, previousCode) {
            setEmployees((currentEmployees) => previousCode
                ? currentEmployees.map((item) => item.code === previousCode ? { ...item, ...employee } : item)
                : [...currentEmployees, { ...employee, status: "Active" }]
            );
        },
        deleteEmployee(code) {
            setEmployees((currentEmployees) => currentEmployees.filter((employee) => employee.code !== code));
        },
        saveShift(shift, id) {
            setShifts((currentShifts) => id
                ? currentShifts.map((item) => item.id === id ? { ...item, ...shift } : item)
                : [...currentShifts, { id: Date.now(), ...shift, status: "Scheduled" }]
            );
        },
        deleteShift(id) {
            setShifts((currentShifts) => currentShifts.filter((shift) => shift.id !== id));
        },
        requestSwap(shiftId, reason) {
            const shift = shifts.find((item) => item.id === shiftId);
            if (!shift) return;
            setShifts((currentShifts) => currentShifts.map((item) => item.id === shiftId ? { ...item, status: "Swap Requested" } : item));
            setSwapRequests((currentRequests) => [...currentRequests, {
                id: Date.now(), employee: shift.employee, date: shift.date, time: shift.time,
                reason, replacementEmployee: "", status: "Pending",
            }]);
        },
        updateSwapRequest(id, changes) {
            setSwapRequests((currentRequests) => currentRequests.map((request) => request.id === id ? { ...request, ...changes } : request));
        },
    }), [employees, shifts, swapRequests]);

    return <ShiftLinkContext.Provider value={value}>{children}</ShiftLinkContext.Provider>;
}

export function useShiftLink() {
    const context = useContext(ShiftLinkContext);
    if (!context) throw new Error("useShiftLink must be used inside ShiftLinkProvider");
    return context;
}
