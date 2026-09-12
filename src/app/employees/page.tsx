"use client"
import {Pencil, Plus, Search, Trash2} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import {useState} from "react";


const initialEmployees = [
    {
        code: "STU001",
        name: "Aung Ko Ko Khant",
        type: "Student",
        department: "Restaurant Service",
        status: "Active",
    },
    {
        code: "EMP002",
        name: "Tanaka Yuki",
        type: "Regular",
        department: "Front Desk",
        status: "Active",
    },
    {
        code: "STU003",
        name: "Maria Santos",
        type: "Student",
        department: "Kitchen",
        status: "Inactive",
    },
];
export default function EmployeesPage() {
    const[searchText, setSearchText] = useState("");
    const[selectedType, setSelectedType] = useState("All Types");
    const[selectedStatus, setSelectedStatus] = useState("All");
    const[isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [employeeList , setEmployeeList] = useState(initialEmployees);
    const [newEmployee , setNewEmployee] = useState({
        code: "",
        name: "",
        type: "Student",
        department: "",
        status: "",

    })
    const [editingEmployeeCode, setEditingEmployeeCode] = useState<string | null>(null);

    const filteredEmployees = employeeList.filter((employee) => {
        const keyword = searchText.toLowerCase();

        const matchesSearch = employee.name.toLowerCase().includes(keyword) ||
            employee.code.toLowerCase().includes(keyword);

        const matchesType = selectedType === "All Types" || employee.type === selectedType;



        const matchesStatus = selectedStatus === "All" || employee.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;

    });

    /* Old Save  Function
    function handleSaveEmployee(){
        if(
            !newEmployee.name.trim() ||
            !newEmployee.code.trim() ||
            !newEmployee.department.trim()
        ){
            alert("Please fill in all fields");
            return;
        }

        const isDuplicatedCode = employeeList.some(
            (employee) =>
                employee.code.toLowerCase()=== newEmployee.code.toLowerCase()
        );

        if(isDuplicatedCode){
            alert("Employee code already exists");
            return;
        }

        setEmployeeList([
            ...employeeList, {
                name: newEmployee.name.trim(),
                code: newEmployee.code.trim(),
                type: newEmployee.type,
                department: newEmployee.department.trim(),
                status: "Active",
            }
        ]);

        setNewEmployee({
            name: "",
            code: "",
            type: "Student",
            department: "",
            status: "",
        });

        setIsAddModalOpen(false);
    }

     */

    // New Save Function
    function handleSaveEmployee() {
        if (
            !newEmployee.name.trim() ||
            !newEmployee.code.trim() ||
            !newEmployee.department.trim()
        ) {
            alert("Please fill in all fields.");
            return;
        }

        const isDuplicateCode = employeeList.some(
            (employee) =>
                employee.code.toLowerCase() === newEmployee.code.trim().toLowerCase() &&
                employee.code !== editingEmployeeCode
        );

        if (isDuplicateCode) {
            alert("Employee code already exists.");
            return;
        }

        if (editingEmployeeCode) {
            setEmployeeList(
                employeeList.map((employee) =>
                    employee.code === editingEmployeeCode
                        ? {
                            ...newEmployee,
                            name: newEmployee.name.trim(),
                            code: newEmployee.code.trim(),
                            department: newEmployee.department.trim(),
                        }
                        : employee
                )
            );
        } else {
            setEmployeeList([
                ...employeeList,
                {
                    ...newEmployee,
                    name: newEmployee.name.trim(),
                    code: newEmployee.code.trim(),
                    department: newEmployee.department.trim(),
                    status: "Active",
                },
            ]);
        }

        setNewEmployee({
            name: "",
            code: "",
            type: "Student",
            department: "",
            status: "",
        });

        setEditingEmployeeCode(null);
        setIsAddModalOpen(false);
    }

    function handleDeleteEmployee(code: string){
        const shouldDelete = confirm("Are you sure you want to delete this employee?");

        if(!shouldDelete){
            return;
        }

        setEmployeeList(
            employeeList.filter((employee) => employee.code !== code)
        );
    }

    function handleEditEmployee(code: string){
        const employee = employeeList.find((employee)=>
        employee.code === code);

        if(!employee){
            return;
        }

        setNewEmployee({
            name: employee.name,
            code: employee.code,
            type: employee.type,
            department: employee.department,
            status: employee.status,
        });

        setEditingEmployeeCode(code);
        setIsAddModalOpen(true);
    }

    function openAddModal() {
        setNewEmployee({
            name: "",
            code: "",
            type: "Student",
            department: "",
            status: "",
        });

        setEditingEmployeeCode(null);
        setIsAddModalOpen(true);
    }



    return (
        <div className="flex min-h-screen bg-base-200">
            <Sidebar/>

            <main className="flex-1 p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Employees</h1>

                        <p className="mt-2 text-base-content/70">
                            Manage employee profiles and work types.
                        </p>
                    </div>

                    <button className="btn btn-primary"
                            onClick={() => openAddModal()}
                    >
                        <Plus size={18}/>
                        Add Employee
                    </button>
                </div>

                <div className="mt-8 flex flex-col gap-3 rounded-box bg-base-100 p-4 shadow sm:flex-row">
                    <label className="input input-bordered flex flex-1 items-center gap-2">
                        <Search size={18} className="text-base-content/60"/>

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
                                    <span
                                        className={`badge ${
                                            employee.type === "Student"
                                                ? "badge-info"
                                                : "badge-warning"
                                        }`}
                                    >
                                        {employee.type}
                                    </span>
                                </td>

                                <td>{employee.department}</td>

                                <td>
                                    <span className="badge badge-success">
                                    {employee.status}
                                    </span>
                                </td>

                                <td>
                                    <button className="btn btn-ghost btn-sm"
                                            onClick={()=>handleEditEmployee(employee.code)}
                                    >
                                        <Pencil size={17}/>
                                    </button>

                                    <button className="btn btn-ghost btn-sm text-error"
                                            onClick={() => handleDeleteEmployee(employee.code)}
                                    >
                                        <Trash2 size={17}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {isAddModalOpen && (
                        <div className="modal modal-open">
                            <div className="modal-box">
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
                                            setNewEmployee({...newEmployee, name: e.target.value})
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
                                                onChange={(e) => setNewEmployee({...newEmployee, code: e.target.value})}
                                            />
                                        </label>

                                        <label className="form-control py-3">
                                            <span className="label-text mb-2">Employee Type</span>

                                            <select className="select select-bordered w-full"
                                                    value={newEmployee.type}
                                                    onChange={(e) => setNewEmployee({...newEmployee, type: e.target.value})}
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
                                            onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
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
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}