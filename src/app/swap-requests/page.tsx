"use client";

import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import { useFeedback } from "@/components/providers/FeedbackProvider";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";
import { isActiveEmployee } from "@/lib/employees";
import {CircleAlert} from "lucide-react";

export default function SwapRequestsPage() {
    const { employees, swapRequests, updateSwapRequest } = useShiftLink();
    const { notify } = useFeedback();
    const {
        // existing values
        isLoadingSwapRequests,
    } = useShiftLink();

    const [selectedReplacementIds, setSelectedReplacementIds] = useState<
        Record<number, number | undefined>
    >({});


    const [statusFilter, setStatusFilter] = useState<
        "All" | "Pending" | "Approved" | "Rejected"
    >("Pending");

    const [processingRequestId, setProcessingRequestId] =
        useState<number | null>(null);

    const availableEmployees = employees.filter(isActiveEmployee);
    const pendingRequestCount = swapRequests.filter(
        (request) => request.status === "Pending"
    ).length;

    const sortedSwapRequests = [...swapRequests].sort((a, b) => {
        const statusOrder = (status: string) =>
            status === "Pending" ? 0 : 1;

        return (
            statusOrder(a.status) - statusOrder(b.status) ||
            b.id - a.id
        );
    });

    const filteredSwapRequests = sortedSwapRequests.filter(
        (request) =>
            statusFilter === "All" || request.status === statusFilter
    );

    async function handleApproveRequest(
        id: number,
        replacementEmployeeId?: number
    ) {
        if (!replacementEmployeeId) {
            notify("Please select a replacement employee first.", "error");
            return;
        }

        setProcessingRequestId(id);

        try {
            await updateSwapRequest(id, { status: "Approved" });
            notify("Swap request approved.");
        } catch (error) {
            notify(
                error instanceof Error ? error.message : "Failed to approve swap request.",
                "error"
            );
        } finally {
            setProcessingRequestId(null);
        }
    }

    async function handleRejectRequest(id: number) {

        setProcessingRequestId(id);

        try {
            await updateSwapRequest(id, { status: "Approved" });
            notify("Swap request approved.");
        } catch (error) {
            notify(
                error instanceof Error ? error.message : "Failed to approve swap request.",
                "error"
            );
        } finally {
            setProcessingRequestId(null);
        }
    }

    return (
        <>
            <PageHeader
                title="Swap Requests"
                description="Review and manage employee shift swap requests."
            />

            {pendingRequestCount > 0 && (
                <div className="mt-6 flex items-center justify-between rounded-box border border-warning/30 bg-warning/10 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <CircleAlert className="text-warning" size={24} />

                        <div>
                            <p className="font-bold text-base-content">
                                {pendingRequestCount} pending swap request
                                {pendingRequestCount > 1 ? "s" : ""}
                            </p>

                            <p className="text-sm text-base-content/70">
                                Review and approve or reject it.
                            </p>
                        </div>
                    </div>

                    <button
                        className="btn btn-warning btn-sm"
                        onClick={() => setStatusFilter("Pending")}
                    >
                        Review now
                    </button>
                </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
                {(["All", "Pending", "Approved", "Rejected"] as const).map(
                    (status) => (
                        <button
                            key={status}
                            className={`btn btn-sm ${
                                statusFilter === status ? "btn-primary" : "btn-outline"
                            }`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status}
                        </button>
                    )
                )}
            </div>

            <div className="mt-8 overflow-x-auto rounded-box bg-base-100 shadow">
                <table className="table min-w-[1050px]">
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
                    {isLoadingSwapRequests ? (
                        <tr>
                            <td colSpan={7} className="py-10 text-center">
                                <span className="loading loading-spinner loading-sm" />
                                <span className="ml-2">Loading swap requests...</span>
                            </td>
                        </tr>
                    ) :filteredSwapRequests.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-10 text-center text-base-content/60 "
                            >
                                {statusFilter === "All"
                                    ? "No swap requests yet."
                                    : `No ${statusFilter.toLowerCase()} swap requests.`}
                            </td>
                        </tr>
                    ) : (
                        filteredSwapRequests.map((request) => {
                        const selectedReplacementId =
                            selectedReplacementIds[request.id] ??
                            request.replacementEmployeeId;

                        return (
                            <tr key={request.id}>
                                <td className="min-w-36 whitespace-nowrap font-medium">{request.employee}</td>

                                <td>
                                    <p>{request.date}</p>
                                    <p className="text-sm text-base-content/60 min-w-36 whitespace-nowrap">
                                        {request.time}
                                    </p>
                                </td>

                                <td className="max-w-xs whitespace-normal min-w-28">
                                    {request.reason}
                                </td>

                                <td>
                                    <select
                                        className="select select-bordered select-sm min-w-48"
                                        value={selectedReplacementId ?? ""}
                                        disabled={request.status !== "Pending"}
                                        onChange={(event) => {
                                            const employeeId = event.target.value
                                                ? Number(event.target.value)
                                                : undefined;

                                            setSelectedReplacementIds((current) => ({
                                                ...current,
                                                [request.id]: employeeId,
                                            }));
                                        }}
                                    >
                                        <option value="">Select employee</option>

                                        {availableEmployees
                                            .filter(
                                                (employee) =>
                                                    employee.name !== request.employee &&
                                                    employee.id !== undefined
                                            )
                                            .map((employee) => (
                                                <option
                                                    key={employee.id}
                                                    value={employee.id}
                                                >
                                                    {employee.name}
                                                </option>
                                            ))}
                                    </select>
                                </td>

                                <td>
                                    <StatusBadge status={request.status} />
                                </td>

                                <td className={"space-x-2"}>
                                    {request.status === "Pending" ? (
                                        <div className="flex gap-2 min-w-44 whitespace-nowrap">
                                            <button
                                                className="btn btn-success btn-sm"
                                                disabled={
                                                    processingRequestId === request.id
                                                }
                                                title={
                                                    !request.replacementEmployeeId
                                                        ? "Select a replacement employee first."
                                                        : undefined
                                                }
                                                onClick={() => handleApproveRequest(request.id)}
                                            >
                                                {processingRequestId === request.id
                                                    ? "Processing..."
                                                    : "Approve"}
                                            </button>

                                            <button
                                                className="btn btn-error btn-sm "
                                                disabled={processingRequestId === request.id}
                                                onClick={() => handleRejectRequest(request.id)}
                                            >
                                                {processingRequestId === request.id
                                                    ? "Processing..."
                                                    : "Reject"}
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-base-content/60">Completed</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
