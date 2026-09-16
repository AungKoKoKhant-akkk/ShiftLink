"use client";

import StatusBadge from "@/components/StatusBadge";
import { Check, X } from "lucide-react";
import type { SwapRequestStatus } from "@/types/swapRequest";
import { isActiveEmployee } from "@/lib/employees";
import PageHeader from "@/components/PageHeader";
import { useFeedback } from "@/components/providers/FeedbackProvider";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";

export default function SwapRequestsPage() {
    const { employees, swapRequests, updateSwapRequest } = useShiftLink();
    const { notify } = useFeedback();
    const availableEmployees = employees.filter(isActiveEmployee);

    function updateRequestStatus(id: number, status: SwapRequestStatus) {
        updateSwapRequest(id, { status });
    }

    function handleApproveRequest(id: number) {
        const request = swapRequests.find((request) => request.id === id);

        if (!request?.replacementEmployee) {
            notify("Please select a replacement employee first.", "error");
            return;
        }

        updateRequestStatus(id, "Approved");
        notify("Swap request approved.");
    }

    return (
        <>
            <PageHeader
                title="Swap Requests"
                description="Review employee shift-swap requests."
            />
            <div className="mt-8 overflow-x-auto rounded-box bg-base-100 shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Shift</th>
                            <th>Reason</th>
                            <th>Replacement Employee</th>
                            <th>Status</th>
                            <th>Manager Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {swapRequests.map((request) => (
                            <tr key={request.id}>
                                <td className="font-medium">{request.employee}</td>

                                <td>
                                    <p>{request.date}</p>

                                    <p className="text-sm text-base-content/60">
                                        {request.time}
                                    </p>
                                </td>

                                <td className="max-w-xs whitespace-normal">
                                    {request.reason}
                                </td>

                                <td>
                                    <select
                                        className="select select-bordered select-sm"
                                        value={request.replacementEmployee}
                                        disabled={request.status !== "Pending"}
                                        onChange={(e) => {
                                            const replacementEmployee = e.target.value;
                                            updateSwapRequest(request.id, { replacementEmployee });
                                        }}
                                    >
                                        <option value="">Select employee</option>

                                        {availableEmployees
                                            .filter((employee) => employee.name !== request.employee)
                                            .map((employee) => (
                                                <option key={employee.code} value={employee.name}>
                                                    {employee.name}
                                                </option>
                                            ))}
                                    </select>
                                </td>

                                <td>
                                    <StatusBadge status={request.status} />
                                </td>

                                <td className="space-x-2">
                                    <button
                                        className="btn btn-success btn-sm"
                                        disabled={request.status !== "Pending"}
                                        onClick={() => handleApproveRequest(request.id)}
                                    >
                                        <Check size={16} />
                                        Approve
                                    </button>

                                    <button
                                        className="btn btn-error btn-sm"
                                        disabled={request.status !== "Pending"}
                                        onClick={() =>
                                            updateRequestStatus(request.id, "Rejected")
                                        }
                                    >
                                        <X size={16} />
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    );
}
