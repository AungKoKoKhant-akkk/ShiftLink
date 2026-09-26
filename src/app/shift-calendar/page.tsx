"use client";

import PageHeader from "@/components/PageHeader";
import ShiftCalendarView from "@/components/ShiftCalendar";
import RoleGuard from "@/components/RoleGuard";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ShiftCalendarPage() {
    const { t } = useLanguage();
    return (
        <>
            <RoleGuard allowedRoles={["Admin", "Manager"]}>
                <>
                    {/* existing page content */}
                </>
            </RoleGuard>
            <PageHeader title={t("shiftCalendar")} description={t("calendarDescription")} />

            <div className="mt-8 rounded-box bg-base-100 p-6 shadow">
                <ShiftCalendarView />
            </div>

        </>
    );
}
