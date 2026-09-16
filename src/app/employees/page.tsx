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

export default function EmployeesPage() {
    const [searchText, setSearchText] = useState("");
    const [selectedType, setSelectedType] = useState("All Types");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { employees, saveEmployee, deleteEmployee } = useShiftLink();
    const { confirm, notify } = useFeedback();
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

    function handleSaveEmployee() {
        const employeeData = {
            ...newEmployee,
            name: newEmployee.name.trim(),
            code: newEmployee.code.trim(),
            department: newEmployee.department.trim(),
        };
        if (
            !employeeData.name ||
            !employeeData.code ||
            !employeeData.department
        ) {
            notify("Please fill in all fields.", "error");
            return;
        }

        const isDuplicateCode = employees.some(
            (employee) =>
                employee.code.toLowerCase() === employeeData.code.toLowerCase() &&
                employee.code !== editingEmployeeCode
        );

        if (isDuplicateCode) {
            notify("Employee code already exists.", "error");
            return;
        }

        saveEmployee(employeeData, editingEmployeeCode ?? undefined);

        setNewEmployee(createEmployeeForm());

        setEditingEmployeeCode(null);
        setIsAddModalOpen(false);
        notify(editingEmployeeCode ? "Employee updated." : "Employee added.");
    }

    async function handleDeleteEmployee(code: string) {
        if (await confirm("Are you sure you want to delete this employee?")) {
            deleteEmployee(code);
            notify("Employee deleted.");
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

    return (
        <>
            <PageHeader
                title="Employees"
                description="Manage employee profiles and work types."
                action={
                    <button className="btn btn-primary" onClick={openAddModal}>
                        <Plus size={18} />
                        Add Employee
                    </button>
                }
            />

            <div className="mt-8 flex flex-col gap-3 rounded-box bg-base-100 p-4 shadow sm:flex-row">
                <label className="input input-bordered flex flex-1 items-center gap-2">
                    <Search size={18} className="text-base-content/60" />

                    <input
                        type="text"
                        className="grow"
                        placeholder="Search by name or employee code"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </label>

                <select className="select select-bordered"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option>All Types</option>
                    <option>Student</option>
                    <option>Regular</option>
                </select>

                <select className="select select-bordered"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option>All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>

            <div className="mt-6 overflow-x-auto rounded-box bg-base-100 shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Employee Code</th>
                            <th>Type</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Actions</th>
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
                            {editingEmployeeCode ? "Edit Employee" : "Add Employee"}
                        </h2>
                        <form className="mt-6 space-y-4  ">
                            <label className="form-control">
                                <span className="label-text mb-2">Employee Name</span>

                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Enter employee name"
                                    value={newEmployee.name}
                                    onChange={(e) =>
                                        setNewEmployee({ ...newEmployee, name: e.target.value })
                                    }
                                />
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2 my-2 ">
                                <label className="form-control py-3">
                                    <span className="label-text mb-2">Employee Code</span>

                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="Example: STU001"
                                        value={newEmployee.code}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, code: e.target.value })}
                                    />
                                </label>

                                <label className="form-control py-3">
                                    <span className="label-text mb-2">Employee Type</span>

                                    <select className="select select-bordered w-full"
                                        value={newEmployee.type}
                                        onChange={(e) => handleEmployeeTypeChange(e.target.value)}
                                    >
                                        <option>Student</option>
                                        <option>Regular</option>
                                    </select>
                                </label>
                            </div>

                            <label className="form-control">
                                <span className="label-text mb-2">Department</span>

                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Example: Restaurant Service"
                                    value={newEmployee.department}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                                />
                            </label>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    Cancel
                                </button>

                                <button type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveEmployee}

                                >
                                    {editingEmployeeCode ? "Update Employee" : "Save Employee"}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>

        </>
    );
}
