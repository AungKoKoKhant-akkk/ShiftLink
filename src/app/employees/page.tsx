"use client";

import StatusBadge from "@/components/StatusBadge";
import EmployeeTypeBadge from "@/components/EmployeeTypeBadge";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import type { EmployeeFormData } from "@/types/employee";
import RecordActions from "@/components/RecordActions";
import { createEmployeeForm } from "@/lib/forms";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import { useFeedback } from "@/components/providers/FeedbackProvider";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";
import RoleGuard from "@/components/RoleGuard";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function EmployeesPage() {
    const [searchText, setSearchText] = useState("");
    const [selectedType, setSelectedType] = useState("All Types");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { employees, saveEmployee, deleteEmployee, currentRole } = useShiftLink();
    const { confirm, notify } = useFeedback();
    const { t } = useLanguage();
    const [newEmployee, setNewEmployee] = useState<EmployeeFormData>(createEmployeeForm);
    const [editingEmployeeCode, setEditingEmployeeCode] = useState<string | null>(null);

    const keyword = searchText.toLowerCase();
    const filteredEmployees = employees.filter((employee) => {

        const matchesSearch = employee.name.toLowerCase().includes(keyword) ||
            employee.code.toLowerCase().includes(keyword);

        const matchesType = selectedType === "All Types" || employee.type === selectedType;

        const matchesStatus = selectedStatus === "All" || employee.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    async function handleSaveEmployee() {
        const employeeData = {
            ...newEmployee,
            name: newEmployee.name.trim(),
            code: newEmployee.code.trim(),
            department: newEmployee.department.trim(),
        };

        if (
            !employeeData.name ||
            !employeeData.code ||
            !employeeData.department ||
            (!editingEmployeeCode && !employeeData.password)
        ) {
            notify(t("fillAllFields"), "error");
            return;
        }

        try {
            await saveEmployee(employeeData, editingEmployeeCode ?? undefined);

            setNewEmployee(createEmployeeForm());
            setEditingEmployeeCode(null);
            setIsAddModalOpen(false);

            notify(
                editingEmployeeCode
                    ? t("employeeUpdated")
                    : t("employeeAdded")
            );
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : t("employeeSaveFailed");

            notify(message, "error");
        }
    }

    async function handleDeleteEmployee(code: string) {
        if (!await confirm(t("deleteEmployeeConfirm"))) {
            return;
        }

        try {
            await deleteEmployee(code);
            notify(t("employeeDeleted"));
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : t("employeeDeleteFailed");

            notify(message, "error");
        }
    }

    function handleEditEmployee(code: string) {
        const employee = employees.find((employee) =>
            employee.code === code);

        if (!employee) {
            return;
        }

        setNewEmployee({
            name: employee.name,
            code: employee.code,
            type: employee.type,
            department: employee.department,
            role: employee.role,
            password: "",
        });

        setEditingEmployeeCode(code);
        setIsAddModalOpen(true);
    }

    function openAddModal() {
        setNewEmployee(createEmployeeForm());

        setEditingEmployeeCode(null);
        setIsAddModalOpen(true);
    }

    function handleEmployeeTypeChange(value: string) {
        if (value !== "Student" && value !== "Regular") {
            return;
        }

        setNewEmployee({ ...newEmployee, type: value });
    }

    if (currentRole !== "Admin") {
        return <RoleGuard allowedRoles={["Admin"]}>{null}</RoleGuard>;
    }

    return (
        <>
            <PageHeader
                title={t("employees")}
                description={t("employeesDescription")}
                action={
                    <button className="btn btn-primary" onClick={openAddModal}>
                        <Plus size={18} />
                        {t("addEmployee")}
                    </button>
                }
            />

            <div className="mt-8 flex flex-col gap-3 rounded-box bg-base-100 p-4 shadow sm:flex-row">
                <label className="input input-bordered flex flex-1 items-center gap-2">
                    <Search size={18} className="text-base-content/60" />

                    <input
                        type="text"
                        className="grow"
                        placeholder={t("searchEmployee")}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </label>

                <select className="select select-bordered"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="All Types">{t("allTypes")}</option>
                    <option value="Student">{t("student")}</option>
                    <option value="Regular">{t("regular")}</option>
                </select>

                <select className="select select-bordered"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="All">{t("all")}</option>
                    <option value="Active">{t("active")}</option>
                    <option value="Inactive">{t("inactive")}</option>
                </select>
            </div>

            <div className="mt-6 overflow-x-auto rounded-box bg-base-100 shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>{t("employee")}</th><th>{t("employeeCode")}</th><th>{t("type")}</th>
                            <th>{t("department")}</th><th>{t("status")}</th><th>{t("actions")}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredEmployees.map((employee) => (
                            <tr key={employee.code}>
                                <td className="font-medium">{employee.name}</td>
                                <td>{employee.code}</td>

                                <td>
                                    <EmployeeTypeBadge type={employee.type} />
                                </td>

                                <td>{employee.department}</td>

                                <td>
                                    <StatusBadge status={employee.status} />
                                </td>

                                <td>
                                    <RecordActions label={employee.name} onEdit={() => handleEditEmployee(employee.code)} onDelete={() => handleDeleteEmployee(employee.code)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isAddModalOpen && (
                    <Modal>
                        <h2 className="text-xl font-bold">
                            {editingEmployeeCode ? t("editEmployee") : t("addEmployee")}
                        </h2>
                        <form className="mt-6 space-y-4  ">
                            <label className="form-control">
                                <span className="label-text mb-2">{t("employeeName")}</span>

                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder={t("enterEmployeeName")}
                                    value={newEmployee.name}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, name: e.target.value })
                                    }
                                />
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2 my-2 ">
                                <label className="form-control py-3">
                                    <span className="label-text mb-2">{t("employeeCode")}</span>

                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder={t("employeeCodeExample")}
                                        value={newEmployee.code}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, code: e.target.value })}
                                    />
                                </label>

                                <label className="form-control py-3">
                                    <span className="label-text mb-2">{t("employeeType")}</span>

                                    <select className="select select-bordered w-full"
                                        value={newEmployee.type}
                                        onChange={(e) => handleEmployeeTypeChange(e.target.value)}
                                    >
                                        <option value="Student">{t("student")}</option>
                                        <option value="Regular">{t("regular")}</option>
                                    </select>
                                </label>
                            </div>

                            <label className="form-control">
                                <span className="label-text mb-2">{t("department")}</span>

                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder={t("departmentExample")}
                                    value={newEmployee.department}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                                />
                            </label>

                            <label className="form-control">
                                <span className="label-text mb-2">{t("initialPassword")}</span>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    placeholder={editingEmployeeCode ? t("keepCurrentPassword") : t("setInitialPassword")}
                                    value={newEmployee.password}
                                    onChange={(event) => setNewEmployee({ ...newEmployee, password: event.target.value })}
                                />
                            </label>

                            <label className="form-control">
                                <span className="label-text mb-2">{t("systemRole")}</span>
                                <select
                                    className="select select-bordered w-full"
                                    value={newEmployee.role}
                                    onChange={(event) => setNewEmployee({ ...newEmployee, role: event.target.value as EmployeeFormData["role"] })}
                                >
                                    <option value="User">{t("user")}</option>
                                    <option value="Manager">{t("manager")}</option>
                                    <option value="Admin">{t("admin")}</option>
                                </select>
                            </label>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    {t("cancel")}
                                </button>

                                <button type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveEmployee}

                                >
                                    {editingEmployeeCode ? t("updateEmployee") : t("saveEmployee")}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>

        </>
    );
}

