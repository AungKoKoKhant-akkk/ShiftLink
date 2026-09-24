"use client";

import {createContext, useContext, useEffect, useMemo, useState} from "react";
import type { ReactNode } from "react";
import {  mockCurrentEmployee } from "@/data/mockEmployees";
import type { Employee, EmployeeFormData } from "@/types/employee";
import type { Shift } from "@/types/shift";
import type { SwapRequest } from "@/types/swapRequest";
import {createEmployee, deleteEmployeeFromApi, getEmployees, updateEmployee} from "@/lib/api/employees";
import {createShift, deleteShiftFromApi, getShifts, updateShift} from "@/lib/api/shifts";
import {createSwapRequest, getSwapRequests, updateSwapRequestStatus} from "@/lib/api/swapRequests";

type ShiftLinkContextValue = {
    employees: Employee[];
    shifts: Shift[];
    swapRequests: SwapRequest[];
    isLoadingShifts: boolean;
    isLoadingSwapRequests: boolean;
    currentEmployee: Employee;
    saveEmployee: (employee: EmployeeFormData, previousCode?: string) => Promise<void>;
    deleteEmployee: (code: string) => Promise<void>;
    saveShift: (
        shift: Omit<Shift, "id" | "status">,
        id?: number
    ) => Promise<void>;

    deleteShift: (id: number) => Promise<void>;
    requestSwap: (shiftId: number, reason: string) => Promise<void>;

    updateSwapRequest: (
        id: number,
        changes: Partial<
            Pick<
                SwapRequest,
                "replacementEmployeeId" | "replacementEmployee" | "status"
            >
        >
    ) => Promise<void>;
};

const ShiftLinkContext = createContext<ShiftLinkContextValue | null>(null);



export function ShiftLinkProvider({ children }: { children: ReactNode }) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [swapRequests, setSwapRequests] =
        useState<SwapRequest[]>([]);
    const [isLoadingShifts, setIsLoadingShifts] = useState(true);
    const [isLoadingSwapRequests, setIsLoadingSwapRequests] =
        useState(true);


    useEffect(() => {
        let isMounted = true;

        async function loadShifts() {
            try {
                const apiShifts = await getShifts();

                if (isMounted) {
                    setShifts(apiShifts);
                }
            } catch (error) {
                console.error("Failed to load shifts from API.", error);
            }finally {
                if(isMounted){
                    setIsLoadingShifts(false);
                }
            }
        }

        void loadShifts();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadEmployees() {
            try {
                const apiEmployees = await getEmployees();

                console.log("Loaded employees:", apiEmployees);

                if (isMounted) {
                    setEmployees(apiEmployees);
                }
            } catch (error) {
                console.error("Failed to load employees from API.", error);
            }
        }

        void loadEmployees();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadSwapRequests() {
            try {
                const apiSwapRequests = await getSwapRequests();

                if (isMounted) {
                    setSwapRequests(apiSwapRequests);
                }
            } catch (error) {
                console.error("Failed to load swap requests from API.", error);
            }
            finally {
                if (isMounted) {
                    setIsLoadingSwapRequests(false);
                }
            }
        }

        void loadSwapRequests();

        return () => {
            isMounted = false;
        };
    }, []);

    const value = useMemo<ShiftLinkContextValue>(() => ({
        employees,
        shifts,
        swapRequests,
        isLoadingSwapRequests,
        isLoadingShifts,
        currentEmployee: employees.find((employee) => employee.code === mockCurrentEmployee.code) ?? mockCurrentEmployee,
        async saveEmployee(employee, previousCode) {
            const existingEmployee = previousCode
                ? employees.find((item) => item.code === previousCode)
                : undefined;

            const employeeToSave: Employee = {
                ...employee,
                id: existingEmployee?.id,
                status: existingEmployee?.status ?? "Active",
            };

            const savedEmployee = previousCode
                ? await updateEmployee(employeeToSave)
                : await createEmployee(employeeToSave);

            setEmployees((currentEmployees) =>
                previousCode
                    ? currentEmployees.map((item) =>
                        item.code === previousCode ? savedEmployee : item
                    )
                    : [...currentEmployees, savedEmployee]
            );
        },

        async deleteEmployee(code) {
            const employee = employees.find((item) => item.code === code);

            if (!employee?.id) {
                throw new Error("Employee ID is missing.");
            }

            await deleteEmployeeFromApi(employee.id);

            setEmployees((currentEmployees) =>
                currentEmployees.filter((item) => item.code !== code)
            );
        },

        async requestSwap(shiftId, reason) {
            const savedRequest = await createSwapRequest(shiftId, reason);

            setSwapRequests((currentRequests) => [
                savedRequest,
                ...currentRequests,
            ]);

            setShifts((currentShifts) =>
                currentShifts.map((shift) =>
                    shift.id === shiftId
                        ? { ...shift, status: "Swap Requested" }
                        : shift
                )
            );
        },

        async updateSwapRequest(id, changes) {
            const status = changes.status;

            if (!status) {
                setSwapRequests((currentRequests) =>
                    currentRequests.map((request) =>
                        request.id === id ? { ...request, ...changes } : request
                    )
                );
                return;
            }

            if (status === "Pending") {
                throw new Error("Select Approved or Rejected.");
            }

            const currentRequest = swapRequests.find(
                (request) => request.id === id
            );

            const replacementEmployeeId =
                changes.replacementEmployeeId ??
                currentRequest?.replacementEmployeeId;

            const savedRequest = await updateSwapRequestStatus(
                id,
                status,
                replacementEmployeeId
            );

            setSwapRequests((currentRequests) =>
                currentRequests.map((request) =>
                    request.id === id ? savedRequest : request
                )
            );

            // API update ပြီးမှ latest shifts ကိုယူရမယ်
            const latestShifts = await getShifts();
            setShifts(latestShifts);
        },


        async saveShift(shift, id) {
            // Trace Error
            // console.log("Shift employee:", JSON.stringify(shift.employee));
            // console.log(
            //     "Employees:",
            //     employees.map((item) => ({
            //         id: item.id,
            //         name: JSON.stringify(item.name),
            //     }))
            // );
            const employee = employees.find(
                (item) => item.name.trim() === shift.employee.trim()
            );

            if (employee?.id === undefined) {
                throw new Error("Selected employee was not found.");
            }

            const savedShift = id
                ? await updateShift({ ...shift, id }, employee.id)
                : await createShift(shift, employee.id);

            setShifts((currentShifts) =>
                id
                    ? currentShifts.map((item) =>
                        item.id === id ? savedShift : item
                    )
                    : [...currentShifts, savedShift]
            );
        },

        async deleteShift(id) {
            await deleteShiftFromApi(id);

            setShifts((currentShifts) =>
                currentShifts.filter((shift) => shift.id !== id)
            );
        },
    }), [employees, shifts, swapRequests]);

    return <ShiftLinkContext.Provider value={value}>{children}</ShiftLinkContext.Provider>;
}





export function useShiftLink() {
    const context = useContext(ShiftLinkContext);
    if (!context) throw new Error("useShiftLink must be used inside ShiftLinkProvider");
    return context;
}
