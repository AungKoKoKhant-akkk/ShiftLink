import type { EmployeeType } from "@/types/employee";

const typeClasses: Record<EmployeeType, string> = {
    Student: "badge-info",
    Regular: "badge-warning",
};

export default function EmployeeTypeBadge({ type }: { type: EmployeeType }) {
    return <span className={`badge ${typeClasses[type]}`}>{type}</span>;
}
