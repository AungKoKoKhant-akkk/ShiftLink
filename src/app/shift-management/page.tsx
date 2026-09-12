"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const initialShifts = [
    {
        id: 1,
        date: "2026-09-16",
        employee: "Aung Ko Ko Khant",
        type: "Student",
        time: "17:00 – 22:00",
        hours: 5,
        breakMinutes: 0,
        status: "Scheduled",
    },
    {
        id: 2,
        date: "2026-09-18",
        employee: "Tanaka Yuki",
        type: "Regular",
        time: "10:00 – 18:00",
        hours: 7,
        breakMinutes: 60,
        status: "Scheduled",
    },
    {
        id: 3,
        date: "2026-09-20",
        employee: "Maria Santos",
        type: "Student",
        time: "16:00 – 22:00",
        hours: 6,
        breakMinutes: 0,
        status: "Scheduled",
    },
];

const employees = [
    { name: "Aung Ko Ko Khant", type: "Student" },
    { name: "Tanaka Yuki", type: "Regular" },
    { name: "Maria Santos", type: "Student" },
];

export default function ShiftManagementPage() {
    const [shiftList, setShiftList] = useState(initialShifts);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingShiftId, setEditingShiftId] = useState<number | null>(null);

    const [newShift, setNewShift] = useState({
        date: "",
        employee: "",
        type: "",
        startTime: "",
        endTime: "",
        breakMinutes: 0,
    });

    function calculateHours(
        startTime: string,
        endTime: string,
        breakMinutes: number
    ) {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        let scheduledMinutes = endTotalMinutes - startTotalMinutes;

        if (scheduledMinutes <= 0) {
            scheduledMinutes += 24 * 60;
        }

        const workingMinutes = scheduledMinutes - breakMinutes;

        return workingMinutes / 60;
    }

    function calculateMaxRollingSevenDayHours(
        shifts: { date: string; hours: number }[],
        newDate: string,
        newHours: number
    ) {
        const allShifts = [
            ...shifts,
            {
                date: newDate,
                hours: newHours,
            },
        ];

        const targetDate = new Date(`${newDate}T00:00:00`);
        let maximumHours = 0;

        for (let offset = -6; offset <= 0; offset++) {
            const windowStart = new Date(targetDate);
            windowStart.setDate(targetDate.getDate() + offset);

            const windowEnd = new Date(windowStart);
            windowEnd.setDate(windowStart.getDate() + 6);

            const totalHours = allShifts
                .filter((shift) => {
                    const shiftDate = new Date(`${shift.date}T00:00:00`);

                    return shiftDate >= windowStart && shiftDate <= windowEnd;
                })
                .reduce((total, shift) => total + shift.hours, 0);

            maximumHours = Math.max(maximumHours, totalHours);
        }

        return maximumHours;
    }

    function resetNewShift() {
        setNewShift({
            date: "",
            employee: "",
            type: "",
            startTime: "",
            endTime: "",
            breakMinutes: 0,
        });
    }

    function handleSaveShift() {
        if (
            !newShift.date ||
            !newShift.employee ||
            !newShift.startTime ||
            !newShift.endTime
        ) {
            alert("Please fill in all fields.");
            return;
        }

        const hours = calculateHours(
            newShift.startTime,
            newShift.endTime,
            newShift.breakMinutes
        );

        if (hours <= 0) {
            alert("Break time must be shorter than the shift duration.");
            return;
        }

        const shiftsToCheck = editingShiftId
            ? shiftList.filter((shift) => shift.id !== editingShiftId)
            : shiftList;

        const studentShifts = shiftsToCheck.filter(
            (shift) =>
                shift.employee === newShift.employee &&
                shift.type === "Student"
        );

        const maximumRollingHours = calculateMaxRollingSevenDayHours(
            studentShifts,
            newShift.date,
            hours
        );

        if (newShift.type === "Student" && maximumRollingHours > 28) {
            alert(
                `This student would work up to ${maximumRollingHours} hours in a 7-day period. The normal limit is 28 hours.`
            );
            return;
        }

        if (editingShiftId) {
            setShiftList(
                shiftList.map((shift) =>
                    shift.id === editingShiftId
                        ? {
                            ...shift,
                            date: newShift.date,
                            employee: newShift.employee,
                            type: newShift.type,
                            time: `${newShift.startTime} – ${newShift.endTime}`,
                            hours,
                            breakMinutes: newShift.breakMinutes,
                        }
                        : shift
                )
            );
        } else {
            setShiftList([
                ...shiftList,
                {
                    id: Date.now(),
                    date: newShift.date,
                    employee: newShift.employee,
                    type: newShift.type,
                    time: `${newShift.startTime} – ${newShift.endTime}`,
                    hours,
                    breakMinutes: newShift.breakMinutes,
                    status: "Scheduled",
                },
            ]);
        }

        resetNewShift();
        setEditingShiftId(null);
        setIsAddModalOpen(false);
    }

    function handleDeleteShift(id: number) {
        const shouldDelete = confirm("Are you sure you want to delete this shift?");

        if (!shouldDelete) {
            return;
        }

        setShiftList(shiftList.filter((shift) => shift.id !== id));
    }

    function handleEditShift(id: number) {
        const shift = shiftList.find((shift) => shift.id === id);

        if (!shift) {
            return;
        }

        setNewShift({
            date: shift.date,
            employee: shift.employee,
            type: shift.type,
            startTime: shift.time.split(" – ")[0],
            endTime: shift.time.split(" – ")[1],
            breakMinutes: shift.breakMinutes,
        });

        setEditingShiftId(id);
        setIsAddModalOpen(true);
    }

    function openAddModal() {
        resetNewShift();
        setEditingShiftId(null);
        setIsAddModalOpen(true);
    }

    return (
        <div className="flex min-h-screen bg-base-200">
            <Sidebar />

            <main className="flex-1 p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Shift Management</h1>

                        <p className="mt-2 text-base-content/70">
                            Create and manage employee shifts.
                        </p>
                    </div>

                    <button className="btn btn-primary" onClick={openAddModal}>
                        <Plus size={18} />
                        Add Shift
                    </button>
                </div>

                <div className="mt-8 overflow-x-auto rounded-box bg-base-100 shadow">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Employee</th>
                            <th>Type</th>
                            <th>Shift Time</th>
                            <th>Break</th>
                            <th>Working Hours</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {shiftList.map((shift) => (
                            <tr key={shift.id}>
                                <td>{shift.date}</td>
                                <td className="font-medium">{shift.employee}</td>

                                <td>
                    <span
                        className={`badge ${
                            shift.type === "Student"
                                ? "badge-info"
                                : "badge-warning"
                        }`}
                    >
                      {shift.type}
                    </span>
                                </td>

                                <td>{shift.time}</td>
                                <td>{shift.breakMinutes} min</td>
                                <td>{shift.hours} h</td>

                                <td>
                    <span className="badge badge-success">
                      {shift.status}
                    </span>
                                </td>

                                <td>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleEditShift(shift.id)}
                                    >
                                        <Pencil size={17} />
                                    </button>

                                    <button
                                        className="btn btn-ghost btn-sm text-error"
                                        onClick={() => handleDeleteShift(shift.id)}
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {isAddModalOpen && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h2 className="text-xl font-bold">
                                {editingShiftId ? "Edit Shift" : "Add Shift"}
                            </h2>

                            <div className="mt-6 space-y-4">
                                <label className="form-control">
                                    <span className="label-text mb-2">Date</span>

                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={newShift.date}
                                        onChange={(e) =>
                                            setNewShift({ ...newShift, date: e.target.value })
                                        }
                                    />
                                </label>

                                <label className="form-control">
                                    <span className="label-text mb-2">Employee</span>

                                    <select
                                        className="select select-bordered w-full"
                                        value={newShift.employee}
                                        onChange={(e) => {
                                            const selectedEmployee = employees.find(
                                                (employee) => employee.name === e.target.value
                                            );

                                            if (!selectedEmployee) {
                                                return;
                                            }

                                            setNewShift({
                                                ...newShift,
                                                employee: selectedEmployee.name,
                                                type: selectedEmployee.type,
                                            });
                                        }}
                                    >
                                        <option value="" disabled>
                                            Select an employee
                                        </option>

                                        {employees.map((employee) => (
                                            <option key={employee.name} value={employee.name}>
                                                {employee.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="form-control">
                                    <span className="label-text mb-2">Employee Type</span>

                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={newShift.type}
                                        disabled
                                    />
                                </label>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="form-control">
                                        <span className="label-text mb-2">Start Time</span>

                                        <input
                                            type="time"
                                            className="input input-bordered w-full"
                                            value={newShift.startTime}
                                            onChange={(e) =>
                                                setNewShift({
                                                    ...newShift,
                                                    startTime: e.target.value,
                                                })
                                            }
                                        />
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2">End Time</span>

                                        <input
                                            type="time"
                                            className="input input-bordered w-full"
                                            value={newShift.endTime}
                                            onChange={(e) =>
                                                setNewShift({
                                                    ...newShift,
                                                    endTime: e.target.value,
                                                })
                                            }
                                        />
                                    </label>
                                </div>

                                <label className="form-control">
                  <span className="label-text mb-2">
                    Break Time (minutes)
                  </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="15"
                                        className="input input-bordered w-full"
                                        value={newShift.breakMinutes}
                                        onChange={(e) =>
                                            setNewShift({
                                                ...newShift,
                                                breakMinutes: Number(e.target.value),
                                            })
                                        }
                                    />
                                </label>

                                <div className="modal-action">
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => {
                                            resetNewShift();
                                            setEditingShiftId(null);
                                            setIsAddModalOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSaveShift}
                                    >
                                        {editingShiftId ? "Update Shift" : "Add Shift"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}