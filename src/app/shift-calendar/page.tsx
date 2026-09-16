import PageHeader from "@/components/PageHeader";
import ShiftCalendarView from "@/components/ShiftCalendar";

export default function ShiftCalendarPage() {
    return (
        <>
            <PageHeader title="Shift Calendar" description="View all employee shifts by date." />

            <div className="mt-8 rounded-box bg-base-100 p-6 shadow">
                <ShiftCalendarView />
            </div>

        </>
    );
}
