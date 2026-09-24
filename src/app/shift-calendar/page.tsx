import PageHeader from "@/components/PageHeader";
import ShiftCalendarView from "@/components/ShiftCalendar";
import RoleGuard from "@/components/RoleGuard";

export default function ShiftCalendarPage() {
    return (
        <>
            <RoleGuard allowedRoles={["Admin", "Manager"]}>
                <>
                    {/* existing page content */}
                </>
            </RoleGuard>
            <PageHeader title="Shift Calendar" description="View all employee shifts by date." />

            <div className="mt-8 rounded-box bg-base-100 p-6 shadow">
                <ShiftCalendarView />
            </div>

        </>
    );
}
