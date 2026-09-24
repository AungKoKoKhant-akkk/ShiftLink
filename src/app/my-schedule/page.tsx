"use client";

import StatusBadge from "@/components/StatusBadge";
import {  useState } from "react";
import { Repeat2 } from "lucide-react";
import type { Shift } from "@/types/shift";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import { getWeekdayName } from "@/lib/date";
import { useFeedback } from "@/components/providers/FeedbackProvider";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";

type MyShift = Shift & {
    day: string;
    displayStatus: Shift["status"] | "Rejected";
};


export default function MySchedulePage() {
    const { shifts, swapRequests, currentUser, requestSwap, isLoadingShifts } = useShiftLink();
    const {notify} = useFeedback();
    const [isSubmitting , setIsSubmitting] = useState(false);


    const latestSwapByShiftId = new Map<number, (typeof swapRequests)[number]>();

    for (const request of swapRequests) {
        if (!latestSwapByShiftId.has(request.shiftId)) {
            latestSwapByShiftId.set(request.shiftId, request);
        }
    }

    const myShifts: MyShift[] = shifts
        .filter((shift) => shift.employee === currentUser?.name)
        .map((shift) => {
            const latestSwap = latestSwapByShiftId.get(shift.id);

            const displayStatus: MyShift["displayStatus"] =
                latestSwap?.status === "Pending"
                    ? "Swap Requested"
                    : latestSwap?.status === "Rejected"
                        ? "Rejected"
                        : shift.status;

            return {
                ...shift,
                day: getWeekdayName(shift.date),
                displayStatus,
            };
        })
        .sort(
            (a, b) =>
                a.date.localeCompare(b.date) ||
                a.time.localeCompare(b.time)
        );




    const [selectedShift, setSelectedShift] =
        useState<MyShift | null>(null);

    const [swapReason, setSwapReason] = useState("");


    async function handleSubmitSwapRequest() {
        if (!selectedShift || isSubmitting) return;

        if (!swapReason.trim()) {
            notify("Please enter a reason.", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            await requestSwap(selectedShift.id, swapReason.trim());

            notify("Swap request submitted.");
            setSelectedShift(null);
            setSwapReason("");
        } catch (error) {
            notify(
                error instanceof Error
                    ? error.message
                    : "Failed to submit swap request.",
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <PageHeader
                title="My Schedule"
                description="View your upcoming shifts and working hours."
            />

            <div className="mt-8 overflow-x-auto rounded-box bg-base-100 shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Shift Time</th>
                            <th>Break</th>
                            <th>Working Hours</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                    {isLoadingShifts ? (
                        <tr>
                            <td colSpan={7} className="py-10 text-center">
                                <span className="loading loading-spinner loading-sm" />
                                <span className="ml-2">Loading shifts...</span>
                            </td>
                        </tr>
                    ) : myShifts.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="py-10 text-center text-base-content/60">
                                No shifts scheduled.
                            </td>
                        </tr>
                    ) : (
                        myShifts.map((shift) => {
                        

                        return (
                            <tr key={shift.id}>
                                <td>{shift.date}</td>
                                <td>{shift.day}</td>
                                <td className="font-medium">{shift.time}</td>
                                <td>{shift.breakMinutes} min</td>
                                <td>{shift.hours} h</td>

                                <td>
                                    <StatusBadge status={shift.displayStatus} />
                                </td>

                                <td>
                                    <button
                                        className="btn btn-outline btn-primary btn-sm"
                                        disabled={shift.displayStatus === "Swap Requested"}
                                        onClick={() => setSelectedShift(shift)}
                                    >
                                        <Repeat2 size={16} />
                                        {shift.displayStatus === "Rejected"
                                            ? "Request Again"
                                            : "Request Swap"}
                                    </button>
                                </td>
                            </tr>
                        );
                        })
                    )}
                    </tbody>
                </table>
            </div>

            {selectedShift && (
                <Modal className="max-w-xl p-7">
                    <h2 className="text-2xl font-bold">Request Shift Swap</h2>

                    <p className="mt-1 text-sm text-base-content/60">
                        Send a request to your manager for approval.
                    </p>

                    <div className="mt-6 rounded-box border border-base-300 bg-base-200 p-4">
                        <p className="font-semibold">{selectedShift.date}</p>

                        <p className="mt-1 text-sm text-base-content/70">
                            {selectedShift.day} · {selectedShift.time}
                        </p>

                        <p className="mt-2 text-sm text-base-content/70">
                            Working hours: {selectedShift.hours} h
                        </p>
                    </div>

                    <div className="mt-6">
                        <label
                            htmlFor="swap-reason"
                            className="mb-2 block text-sm font-medium"
                        >
                            Reason
                        </label>

                        <textarea
                            id="swap-reason"
                            className="textarea textarea-bordered h-28 w-full"
                            placeholder="Example: I have a school event."
                            value={swapReason}
                            onChange={(e) => setSwapReason(e.target.value)}
                        />
                    </div>

                    <div className="modal-action mt-7">
                        <button
                            className="btn"
                            disabled={isSubmitting}
                            onClick={() => {
                                setSelectedShift(null);
                                setSwapReason("");
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            onClick={handleSubmitSwapRequest}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
