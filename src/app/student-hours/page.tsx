
import Sidebar from "@/components/Sidebar";

const studentHours = [
    {
        id: 1,
        name: "Aung Ko Ko Khant",
        employeeCode: "STU001",
        hours: 24.5,
    },
    {
        id: 2,
        name: "Maria Santos",
        employeeCode: "STU003",
        hours: 16,
    },
    {
        id: 3,
        name: "Sato Ken",
        employeeCode: "STU004",
        hours: 28,
    },
];

export default function StudentHoursPage(){
    return (
        <div className="flex min-h-screen bg-base-200">
            <Sidebar />

            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold">Student Hours</h1>

                <p className="mt-2 text-base-content/70">
                    Monitor student work hours for the 28-hour rule.
                </p>

                <div className="mt-8 flex flex-col justify-between gap-3 rounded-box bg-base-100 p-4 shadow sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-bold">Current monitoring period</h2>

                        <p className="text-sm text-base-content/60">
                            Rolling 7-day work-hour calculation
                        </p>
                    </div>

                    <span className="badge badge-primary badge-outline">
                        Limit: 28 hours
                    </span>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {studentHours.map((student) => {
                        const percentage = (student.hours / 28) * 100;
                        const isOverLimit = student.hours > 28;
                        const isNearLimit = student.hours >= 24 && student.hours <= 28;

                        return (
                            <div key={student.id} className="card bg-base-100 shadow">
                                <div className="card-body">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="card-title">{student.name}</h2>

                                            <p className="text-sm text-base-content/60">
                                                {student.employeeCode}
                                            </p>
                                        </div>

                                        <span
                                            className={`badge ${
                                                isOverLimit
                                                    ? "badge-error"
                                                    : isNearLimit
                                                        ? "badge-warning"
                                                        : "badge-success"
                                            }`}
                                        >
                                            {isOverLimit
                                            ? "Over limit"
                                            : isNearLimit
                                            ? "Near limit"
                                            : "Safe"}
                                        </span>
                                    </div>

                                    <div className="mt-5">
                                        <p className="text-3xl font-bold">
                                            {student.hours}
                                            <span className="text-base font-normal"> / 28 h</span>
                                        </p>

                                        <progress
                                            className={`progress mt-3 w-full ${
                                                isOverLimit
                                                    ? "progress-error"
                                                    : isNearLimit
                                                        ? "progress-warning"
                                                        : "progress-success"
                                            }`}
                                            value={Math.min(percentage, 100)}
                                            max="100"
                                        />

                                        <p className="mt-2 text-sm text-base-content/60">
                                            {(28 - student.hours).toFixed(1)} hours remaining
                                        </p>


                                    </div>

                                </div>

                            </div>

                        );
                    })}
                </div>
            </main>
        </div>
    );
}