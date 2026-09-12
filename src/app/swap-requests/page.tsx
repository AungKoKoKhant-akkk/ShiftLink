"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const initialRequests = [
    {
        id: 1,
        employee: "Aung Ko Ko Khant",
        date: "2026-09-16",
        time: "17:00 – 22:00",
        reason: "I have a school event.",
        status: "Pending",
        replacementEmployee: "",
    },
    {
        id: 2,
        employee: "Maria Santos",
        date: "2026-09-20",
        time: "16:00 – 22:00",
        reason: "I need to attend a medical appointment.",
        status: "Pending",
        replacementEmployee: "",
    },
];

const availableEmployees = [
    "Tanaka Yuki",
    "Maria Santos",
    "Sato Ken",
];

export default function SwapRequestsPage() {
    const [requestList, setRequestList] = useState(initialRequests);

    function updateRequestStatus(id: number, status: string) {
        setRequestList(
            requestList.map((request) =>
                request.id === id ? { ...request, status } : request
            )
        );
    }

    function handleApproveRequest(id: number) {
        const request = requestList.find((request) => request.id === id);

        if (!request?.replacementEmployee) {
            alert("Please select a replacement employee first.");
            return;
        }

        updateRequestStatus(id, "Approved");
    }

    return (
        <div className="flex min-h-screen bg-base-200">
            <Sidebar />

            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold">Swap Requests</h1>

                <p className="mt-2 text-base-content/70">
                    Review employee shift-swap requests.
                </p>

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
                        {requestList.map((request) => (
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
                                        onChange={(e) =>
                                            setRequestList(
                                                requestList.map((item) =>
                                                    item.id === request.id
                                                        ? {
                                                            ...item,
                                                            replacementEmployee: e.target.value,
                                                        }
                                                        : item
                                                )
                                            )
                                        }
                                    >
                                        <option value="">Select employee</option>

                                        {availableEmployees
                                            .filter((employee) => employee !== request.employee)
                                            .map((employee) => (
                                                <option key={employee} value={employee}>
                                                    {employee}
                                                </option>
                                            ))}
                                    </select>
                                </td>

                                <td>
                    <span
                        className={`badge ${
                            request.status === "Approved"
                                ? "badge-success"
                                : request.status === "Rejected"
                                    ? "badge-error"
                                    : "badge-warning"
                        }`}
                    >
                      {request.status}
                    </span>
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
            </main>
        </div>
    );
}