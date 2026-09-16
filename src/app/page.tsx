import { mockDashboardStats, mockDashboardStudentHours } from "@/data/mockDashboard";
import { STUDENT_HOUR_LIMIT } from "@/lib/studentHours";
import PageHeader from "@/components/PageHeader";
import { Plus } from "lucide-react";
import ShiftCalendar from "@/components/ShiftCalendar";
export default function Home() {
    return (
        <>
            <PageHeader
                title="Dashboard"
                description="Welcome to ShiftLink"
                action={
                    <button className="btn btn-primary">
                        <Plus size={18} />
                        Add Shift
                    </button>
                }
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {mockDashboardStats.map((stat) => (
                    <div key={stat.title} className="stats bg-base-100 shadow">
                        <div className="stat">
                            <div className="stat-title">{stat.title}</div>
                            <div className={`stat-value ${stat.color}`}>{stat.value}</div>
                            <div className="stat-desc">{stat.description}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 grid items-start gap-6 xl:grid-cols-3">
                <section className="card bg-base-100 shadow xl:col-span-2">
                    <div className="card-body">
                        <h2 className="card-title">This Week&apos;s Shift Overview</h2>

                        <ShiftCalendar />
                    </div>
                </section>

                <aside className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title">Student Hours</h2>

                        <p className="text-3xl font-bold">
                            {mockDashboardStudentHours} <span className="text-lg font-normal">/ {STUDENT_HOUR_LIMIT.toFixed(1)} h</span>
                        </p>

                        <progress
                            className="progress progress-warning w-full"
                            value={mockDashboardStudentHours}
                            max={STUDENT_HOUR_LIMIT}
                        />

                        <p className="text-sm text-base-content/70">
                            {(STUDENT_HOUR_LIMIT - mockDashboardStudentHours).toFixed(1)} hours remaining
                        </p>

                        <div className="alert alert-warning text-sm">
                            <span>Approaching weekly limit</span>
                        </div>
                    </div>
                </aside>
            </div>

        </>
    )
}
