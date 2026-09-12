"use client"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/classic";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";

const shiftEvents = [
    {
        title: "Aung · 17:00–22:00",
        date: "2026-09-16",
        color: "#8b5cf6",
    },
    {
        title: "Yuki · 10:00–18:00",
        date: "2026-09-18",
        color: "#3b82f6",
    },
    {
        title: "Aung · 16:00–22:00",
        date: "2026-09-20",
        color: "#22c55e",
    },
];

export default function ShiftCalendar(){
    return(


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
