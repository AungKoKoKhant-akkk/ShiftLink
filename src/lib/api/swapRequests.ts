import { getApiBaseUrl } from "@/lib/api/config";
import {SwapRequest} from "@/types/swapRequest";

type ApiSwapRequest = {
    id: number;
    shiftId: number;
    employeeName: string;
    shiftDate: string;
    startTime: string;
    endTime: string;
    reason: string;
    replacementEmployeeId: number | null;
    replacementEmployeeName: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
    requestedAt: string;
};

const API_URL = `${getApiBaseUrl()}/api/swap-requests`;

function toFrontendStatus(
    status: ApiSwapRequest["status"]
): SwapRequest["status"] {
    if (status === "APPROVED") return "Approved";
    if (status === "REJECTED") return "Rejected";

    return "Pending";
}

function formatTime(time: string): string {
    return time.slice(0, 5);
}

function toFrontendSwapRequest(
    request: ApiSwapRequest
): SwapRequest {
    return {
        id: request.id,
        shiftId: request.shiftId,
        employee: request.employeeName,
        date: request.shiftDate,
        time: `${formatTime(request.startTime)} – ${formatTime(request.endTime)}`,
        reason: request.reason,
        replacementEmployeeId: request.replacementEmployeeId ?? undefined,
        replacementEmployee: request.replacementEmployeeName ?? "",
        status: toFrontendStatus(request.status),
    };
}

async function readError(response: Response): Promise<string> {
    const data = await response.json().catch(() => null);

    return data?.message ?? "Something went wrong.";
}

export async function getSwapRequests(): Promise<SwapRequest[]> {
    const response = await fetch(API_URL, { credentials: "include" });

    if (!response.ok) {
        throw new Error(await readError(response));
    }

    const data: ApiSwapRequest[] = await response.json();

    return data.map(toFrontendSwapRequest);
}

export async function getMySwapRequests(): Promise<SwapRequest[]> {
    const response = await fetch(`${API_URL}/my`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await readError(response));
    }

    const data: ApiSwapRequest[] = await response.json();

    return data.map(toFrontendSwapRequest);
}

export async function createSwapRequest(
    shiftId: number,
    reason: string
): Promise<SwapRequest> {
    const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ shiftId, reason }),
    });

    if (!response.ok) {
        throw new Error(await readError(response));
    }

    const data: ApiSwapRequest = await response.json();

    return toFrontendSwapRequest(data);
}

export async function updateSwapRequestStatus(
    id: number,
    status: "Approved" | "Rejected",
    replacementEmployeeId?: number
): Promise<SwapRequest> {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status: status.toUpperCase(),
            replacementEmployeeId,
        }),
    });

    if (!response.ok) {
        throw new Error(await readError(response));
    }

    const data: ApiSwapRequest = await response.json();

    return toFrontendSwapRequest(data);
}