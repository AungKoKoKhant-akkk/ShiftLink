import Sidebar from "@/components/Sidebar";
import ShiftCalendarView from "@/components/ShiftCalendar";

export default function ShiftCalendarPage(){
    return (
        <div className="flex min-h-screen bg-base-200">
            <Sidebar />

            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold">Shift Calendar</h1>

                <p className="mt-2 text-base-content/70">
                    View all employee shifts by date.
                </p>

                <div className="mt-8 rounded-box bg-base-100 p-6 shadow">
                    <ShiftCalendarView />
                </div>
            </main>
        </div>
    );
}
