import type { EmployeeStatus } from "@/types/employee";
import type { ShiftStatus } from "@/types/shift";
import type { SwapRequestStatus } from "@/types/swapRequest";

type Status = EmployeeStatus | ShiftStatus | SwapRequestStatus
    | "Safe" | "Near limit" | "Over limit";

const statusClasses: Record<Status, string> = {
    Active: "badge-success",
    Inactive: "badge-success",
    Scheduled: "badge-success",
    Completed: "badge-success",
    "Swap Requested": "badge-warning",
    Pending: "badge-warning",
    Approved: "badge-success",
    Rejected: "badge-error",
    Safe: "badge-success",
    "Near limit": "badge-warning",
    "Over limit": "badge-error",
};

export default function StatusBadge({ status }: { status: Status }) {
    return <span className={`badge ${statusClasses[status]}`}>{status}</span>;
}
