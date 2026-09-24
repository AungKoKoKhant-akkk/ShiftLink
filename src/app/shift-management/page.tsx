"use client";

import StatusBadge from "@/components/StatusBadge";
import EmployeeTypeBadge from "@/components/EmployeeTypeBadge";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { ShiftFormData } from "@/types/shift";
import {  calculateWorkingHours } from "@/lib/shiftCalculator";
import RecordActions from "@/components/RecordActions";
import { createShiftForm } from "@/lib/forms";
import { isActiveEmployee } from "@/lib/employees";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import { useFeedback } from "@/components/providers/FeedbackProvider";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";
import RoleGuard from "@/components/RoleGuard";

export default function ShiftManagementPage() {
    const { employees, shifts, saveShift, deleteShift } = useShiftLink();
    const { confirm, notify } = useFeedback();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingShiftId, setEditingShiftId] = useState<number | null>(null);

    const [newShift, setNewShift] = useState<ShiftFormData>(createShiftForm);

    const activeEmployees = employees.filter(isActiveEmployee);

    function resetNewShift() {
        setNewShift(createShiftForm());
    }

    async function handleSaveShift() {
        if (
            !newShift.date ||
            !newShift.employee ||
            !newShift.startTime ||
            !newShift.type ||
            !newShift.endTime
        ) {
            notify("Please fill in all fields.", "error");
            return;
        }

        const hours = calculateWorkingHours(
            newShift.startTime,
            newShift.endTime,
            newShift.breakMinutes
        );

        if (!Number.isFinite(hours) || hours <= 0) {
            notify(
                "Break time must be non-negative and shorter than the shift duration.",
                "error"
            );
            return;
        }

        const shiftData = {
            date: newShift.date,
            employee: newShift.employee,
            type: newShift.type,
            time: `${newShift.startTime} – ${newShift.endTime}`,
            hours,
            breakMinutes: newShift.breakMinutes,
        };

        try {
            await saveShift(shiftData, editingShiftId ?? undefined);

            resetNewShift();
            setEditingShiftId(null);
            setIsAddModalOpen(false);

            notify(editingShiftId ? "Shift updated." : "Shift added.");
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Failed to save shift.";

            notify(message, "error");
        }
    }

    async function handleDeleteShift(id: number) {
        if (!await confirm("Are you sure you want to delete this shift?")) {
            return;
        }

        try {
            await deleteShift(id);
            notify("Shift deleted.");
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Failed to delete shift.";

            notify(message, "error");
        }
    }

    function handleEditShift(id: number) {
        const shift = shifts.find((shift) => shift.id === id);

        if (!shift) {
            return;
        }

        const [startTime, endTime] = shift.time.split(" – ");

        setNewShift({
            date: shift.date,
            employee: shift.employee,
            type: shift.type,
            startTime,
            endTime,
            breakMinutes: shift.breakMinutes,
        });

        setEditingShiftId(id);
        setIsAddModalOpen(true);
    }

    return (
        <>
            <RoleGuard allowedRoles={["Admin", "Manager"]}>
                <>
                    {/* existing page content */}
                </>
            </RoleGuard>
            <PageHeader
                title="Shift Management"
                description="Create and manage employee shifts."
                action={
                    <button className="btn btn-primary" onClick={() => {
                        resetNewShift();
                        setEditingShiftId(null);
                        setIsAddModalOpen(true);
                    }}>
                        <Plus size={18} />
                        Add Shift
                    </button>
                }
            />

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
                        {shifts.map((shift) => (
                            <tr key={shift.id}>
                                <td>{shift.date}</td>
                                <td className="font-medium">{shift.employee}</td>

                                <td>
                                    <EmployeeTypeBadge type={shift.type} />
                                </td>

                                <td>{shift.time}</td>
                                <td>{shift.breakMinutes} min</td>
                                <td>{shift.hours} h</td>

                                <td>
                                    <StatusBadge status={shift.status} />
                                </td>

                                <td>
                                    <RecordActions label={`shift for ${shift.employee}`} onEdit={() => handleEditShift(shift.id)} onDelete={() => handleDeleteShift(shift.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAddModalOpen && (
                <Modal>
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

                            {editingShiftId !== null ? (
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={newShift.employee}
                                    disabled
                                />
                            ) : (
                                <select
                                    className="select select-bordered w-full"
                                    value={newShift.employee}
                                    onChange={(e) => {
                                        const selectedEmployee = activeEmployees.find(
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

                                    {activeEmployees.map((employee) => (
                                        <option key={employee.code} value={employee.name}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                            )}
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
                </Modal>
            )}

        </>
    );
}
