"use client"
import Sidebar from "@/components/Sidebar";
import {Repeat2} from "lucide-react";
import {useState} from "react";

const myShifts = [
    {
        id: 1,
        date: "2026-09-16",
        day: "Wednesday",
        time: "17:00 – 22:00",
        breakMinutes: 0,
        hours: 5,
        status: "Scheduled",
    },
    {
        id: 2,
        date: "2026-09-18",
        day: "Friday",
        time: "17:00 – 22:00",
        breakMinutes: 0,
        hours: 5,
        status: "Scheduled",
    },
    {
        id: 3,
        date: "2026-09-20",
        day: "Sunday",
        time: "13:00 – 22:00",
        breakMinutes: 60,
        hours: 8,
        status: "Scheduled",
    },
];

export default function MySchedulePage() {
    const [selectedShift, setSelectedShift] = useState<
        (typeof myShifts)[number] | null
    >(null);

    const [swapReason, setSwapReason] = useState("");
    const [myShiftList , setMyShiftList ] = useState(myShifts);

    function handleSubmitSwapRequest() {
        if (!selectedShift) {
            return;
        }

        if (!swapReason.trim()) {
            alert("Please enter a reason.");
            return;
        }

        setMyShiftList(
            myShiftList.map((shift) =>
                shift.id === selectedShift.id
                    ? { ...shift, status: "Swap Requested" }
                    : shift
            )
        );

        setSelectedShift(null);
        setSwapReason("");
    }

    return (
        <div className="flex min-h-screen bg-base-200">
            <Sidebar />

            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold">My Schedule</h1>

                <p className="mt-2 text-base-content/70">
                    View your upcoming shifts and working hours.
                </p>

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
                        {myShiftList.map((shift) => (
                            <tr key={shift.id}>
                                <td>{shift.date}</td>
                                <td>{shift.day}</td>
                                <td className="font-medium">{shift.time}</td>
                                <td>{shift.breakMinutes} min</td>
                                <td>{shift.hours} h</td>

                                <td>
                                    <span
                                        className={`badge ${
                                            shift.status === "Swap Requested"
                                                ? "badge-warning"
                                                : "badge-success"
                                        }`}
                                    >
                                        {shift.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-outline btn-primary btn-sm"
                                        onClick={() => setSelectedShift(shift)}
                                    >
                                        <Repeat2 size={16} />
                                        Request Swap
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {selectedShift && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-xl p-7">
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
                                    onClick={() => {
                                        setSelectedShift(null);
                                        setSwapReason("");
                                    }}
                                >
                                    Cancel
                                </button>

                                <button className="btn btn-primary"
                                        onClick={handleSubmitSwapRequest}
                                >
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}