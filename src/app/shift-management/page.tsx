"use client";

import StatusBadge from "@/components/StatusBadge";
import EmployeeTypeBadge from "@/components/EmployeeTypeBadge";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { ShiftFormData } from "@/types/shift";
import {  calculateWorkingHours } from "@/lib/shiftCalculator";
import RecordActions from "@/components/RecordActions";
import { createShiftForm } from "@/lib/forms";
import { isAssignableEmployee } from "@/lib/employees";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import { useFeedback } from "@/components/providers/FeedbackProvider";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";
import RoleGuard from "@/components/RoleGuard";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ShiftManagementPage() {
    const { employees, shifts, saveShift, deleteShift } = useShiftLink();
    const { confirm, notify } = useFeedback();
    const { t } = useLanguage();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingShiftId, setEditingShiftId] = useState<number | null>(null);

    const [newShift, setNewShift] = useState<ShiftFormData>(createShiftForm);

    const activeEmployees = employees.filter(isAssignableEmployee);

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
            notify(t("fillAllFields"), "error");
            return;
        }

        const hours = calculateWorkingHours(
            newShift.startTime,
            newShift.endTime,
            newShift.breakMinutes
        );

        if (!Number.isFinite(hours) || hours <= 0) {
            notify(
                t("invalidBreak"),
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

            notify(editingShiftId ? t("shiftUpdated") : t("shiftAdded"));
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : t("shiftSaveFailed");

            notify(message, "error");
        }
    }

    async function handleDeleteShift(id: number) {
        if (!await confirm(t("deleteShiftConfirm"))) {
            return;
        }

        try {
            await deleteShift(id);
            notify(t("shiftDeleted"));
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : t("shiftDeleteFailed");

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
                title={t("shiftManagement")}
                description={t("shiftManagementDescription")}
                action={
                    <button className="btn btn-primary" onClick={() => {
                        resetNewShift();
                        setEditingShiftId(null);
                        setIsAddModalOpen(true);
                    }}>
                        <Plus size={18} />
                        {t("addShift")}
                    </button>
                }
            />

            <div className="mt-8 overflow-x-auto rounded-box bg-base-100 shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>{t("date")}</th>
                            <th>{t("employee")}</th>
                            <th>{t("type")}</th>
                            <th>{t("shiftTime")}</th>
                            <th>{t("break")}</th>
                            <th>{t("workingHours")}</th>
                            <th>{t("status")}</th>
                            <th>{t("actions")}</th>
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
                                <td>{shift.breakMinutes} {t("minutesShort")}</td>
                                <td>{shift.hours} {t("hoursShort")}</td>

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
                        {editingShiftId ? t("editShift") : t("addShift")}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <label className="form-control">
                            <span className="label-text mb-2">{t("date")}</span>

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
                            <span className="label-text mb-2">{t("employee")}</span>

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
                                        {t("selectEmployee")}
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
                            <span className="label-text mb-2">{t("employeeType")}</span>

                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={newShift.type}
                                disabled
                            />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="form-control">
                                <span className="label-text mb-2">{t("startTime")}</span>

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
                                <span className="label-text mb-2">{t("endTime")}</span>

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
                                {t("breakMinutes")}
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
                                {t("cancel")}
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSaveShift}
                            >
                                {editingShiftId ? t("updateShift") : t("addShift")}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

        </>
    );
}
