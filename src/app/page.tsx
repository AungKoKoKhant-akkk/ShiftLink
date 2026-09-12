import { Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ShiftCalendar from "@/components/ShiftCalendar";
// const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default function Home(){
  return(
      <div className={"flex min-h-screen bg-base-200"}>
          <Sidebar />

      <main className="flex-1 bg-base-200 p-8">
          <div className="flex items-start justify-between">
              <div>
                  <h1 className="text-3xl font-bold">Dashboard</h1>

                  <p className="mt-2 text-base-content/70">
                      Welcome to ShiftLink
                  </p>
              </div>

              <button className="btn btn-primary">
                  <Plus size={18} />
                  Add Shift
              </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="stats bg-base-100 shadow">
                  <div className="stat">
                      <div className="stat-title">Total Employees</div>
                      <div className="stat-value text-primary">24</div>
                      <div className="stat-desc">Active employees</div>
                  </div>
              </div>

              <div className="stats bg-base-100 shadow">
                  <div className="stat">
                      <div className="stat-title">Student Employees</div>
                      <div className="stat-value text-info">8</div>
                      <div className="stat-desc">28-hour tracking enabled</div>
                  </div>
              </div>

              <div className="stats bg-base-100 shadow">
                  <div className="stat">
                      <div className="stat-title">This Month Shifts</div>
                      <div className="stat-value text-secondary">86</div>
                      <div className="stat-desc">September 2026</div>
                  </div>
              </div>

              <div className="stats bg-base-100 shadow">
                  <div className="stat">
                      <div className="stat-title">Open Swap Requests</div>
                      <div className="stat-value text-warning">3</div>
                      <div className="stat-desc">Manager approval needed</div>
                  </div>
              </div>
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
                          24.5 <span className="text-lg font-normal">/ 28.0 h</span>
                      </p>

                      <progress
                          className="progress progress-warning w-full"
                          value="24.5"
                          max="28"
                      />

                      <p className="text-sm text-base-content/70">
                          3.5 hours remaining
                      </p>

                      <div className="alert alert-warning text-sm">
                          <span>Approaching weekly limit</span>
                      </div>
                  </div>
              </aside>
          </div>
      </main>


      </div>
  )
}
