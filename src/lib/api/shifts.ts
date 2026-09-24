import type { Shift } from "@/types/shift";

const API_BASE_URL = "http://localhost:8080";

type ApiShift = {
    id: number;
    employeeId: number;
    employeeName: string;
    employeeType: "STUDENT" | "REGULAR";
    shiftDate: string;
    startTime: string;
    endTime: string;
    breakMinutes: number;
    workingHours: number;
    status: "SCHEDULED" | "SWAP_REQUESTED" | "COMPLETED";
};

function toFrontendShift(shift: ApiShift): Shift {
    return {
        id: shift.id,
        date: shift.shiftDate,
        employee: shift.employeeName,
        type: shift.employeeType === "STUDENT" ? "Student" : "Regular",
        time: `${shift.startTime.slice(0, 5)} – ${shift.endTime.slice(0, 5)}`,
        hours: shift.workingHours,
        breakMinutes: shift.breakMinutes,
        status:
            shift.status === "SCHEDULED"
                ? "Scheduled"
                : shift.status === "SWAP_REQUESTED"
                    ? "Swap Requested"
                    : "Completed",
    };
}

function getStartAndEndTime(time: string) {
    const [startTime, endTime] = time.split(" – ");

    if (!startTime || !endTime) {
        throw new Error("Invalid shift time.");
    }

    return { startTime, endTime };
}

async function getErrorMessage(response: Response) {
    const body = await response.json().catch(() => null);

    return body?.message ?? "Request failed.";
}

export async function getShifts(): Promise<Shift[]> {
    const response = await fetch(`${API_BASE_URL}/api/shifts`, {
        cache: "no-store",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const shifts: ApiShift[] = await response.json();

    return shifts.map(toFrontendShift);
}

export async function getMyShifts(): Promise<Shift[]> {
    const response = await fetch(`${API_BASE_URL}/api/shifts/my`, {
        cache: "no-store",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const shifts: ApiShift[] = await response.json();

    return shifts.map(toFrontendShift);
}

export async function createShift(
    shift: Omit<Shift, "id" | "status">,
    employeeId: number
): Promise<Shift> {
    const { startTime, endTime } = getStartAndEndTime(shift.time);

    const response = await fetch(`${API_BASE_URL}/api/shifts`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            employeeId,
            shiftDate: shift.date,
            startTime,
            endTime,
            breakMinutes: shift.breakMinutes,
        }),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const createdShift: ApiShift = await response.json();

    return toFrontendShift(createdShift);
}

export async function updateShift(
    shift: Omit<Shift, "status">,
    employeeId: number
): Promise<Shift> {
    const { startTime, endTime } = getStartAndEndTime(shift.time);

    const response = await fetch(`${API_BASE_URL}/api/shifts/${shift.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            employeeId,
            shiftDate: shift.date,
            startTime,
            endTime,
            breakMinutes: shift.breakMinutes,
        }),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const updatedShift: ApiShift = await response.json();

    return toFrontendShift(updatedShift);
}

export async function deleteShiftFromApi(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/shifts/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }
}