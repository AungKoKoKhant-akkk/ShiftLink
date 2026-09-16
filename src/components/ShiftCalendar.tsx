"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/classic";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";

export default function ShiftCalendar() {
    const { shifts } = useShiftLink();
    const shiftEvents = shifts.map((shift) => ({
        title: `${shift.employee.split(" ")[0]} · ${shift.time}`,
        date: shift.date,
        color: shift.type === "Student" ? "#8b5cf6" : "#3b82f6",
    }));
    return (
        <div className="mt-4">
            <FullCalendar
                plugins={[themePlugin, dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate="2026-09-01"
                fixedWeekCount={false}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "",
                }}
                height={460}
                events={shiftEvents}
            />
        </div>
    )
}
