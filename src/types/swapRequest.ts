export type SwapRequestStatus = "Pending" | "Approved" | "Rejected";

export interface SwapRequest {
    id: number;
    employee: string;
    date: string;
    time: string;
    reason: string;
    replacementEmployee: string;
    status: SwapRequestStatus;
}
