"use client";
import { useRef, useState } from "react";

import { CalendarHeader } from "./CalendarHeader";
import { CalendarEventCard } from "./CalendarEventCard";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventContentArg } from "@fullcalendar/core";
import { CalendarEvent } from "@/app/types/calender-events";

// Sample event data

interface serviceCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  showPublishService?: boolean;
}

const frenchDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export function ServiceCalendar({
  events,
  showPublishService,
}: serviceCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 24));

  const handlePrevWeek = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.prev();
      setCurrentDate(api.getDate());
    }
  };

  const handleNextWeek = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.next();
      setCurrentDate(api.getDate());
    }
  };

  const handlePrevMonth = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      api.gotoDate(newDate);
      setCurrentDate(newDate);
    }
  };

  const handleNextMonth = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      api.gotoDate(newDate);
      setCurrentDate(newDate);
    }
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const event = events.find((e) => e.id === eventInfo.event.id);
    if (!event) return null;

    return <CalendarEventCard event={event} />;
  };

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
  }));

  return (
    <div className="p-6 bg-white text-gray-600 min-h-screen">
      <CalendarHeader
        currentDate={currentDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        showPublishServiceButton={showPublishService}
      />

      <div className="mt-6 calendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          initialDate={currentDate}
          locale="fr"
          firstDay={1}
          headerToolbar={false}
          slotMinTime="09:00:00"
          slotMaxTime="13:00:00"
          slotDuration="01:00:00"
          slotLabelInterval="01:00:00"
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          dayHeaderFormat={{
            weekday: "short",
            day: "numeric",
          }}
          dayHeaderContent={(arg) => {
            const dayName = frenchDays[arg.date.getDay()];
            const dayNum = arg.date.getDate();
            const isToday = arg.isToday;
            return (
              <div
                className={`text-center py-2 ${
                  isToday ? "font-bold text-foreground" : "text-slate-400"
                }`}
              >
                <span>
                  {dayName} {dayNum}
                </span>
              </div>
            );
          }}
          allDaySlot={false}
          events={calendarEvents}
          eventContent={renderEventContent}
          height="auto"
          eventMinHeight={120}
          eventDisplay="block"
        />
      </div>

      <style>{`
      thead{
            border: 1px solid black;
      }
        .calendar-wrapper .fc {
          font-family: inherit;
        }
        .calendar-wrapper .fc-theme-standard td,
        .calendar-wrapper .fc-theme-standard th {
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .fc-theme-standard .fc-scrollgrid {
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .fc-timegrid-slot-label {
          font-size: 0.875rem;
          color: hsl(var(--slate-400));
          font-weight: 500;
        }
        .calendar-wrapper .fc-timegrid-axis-cushion {
          text-transform: uppercase;
        }
        .calendar-wrapper .fc-col-header-cell {
          background: hsl(var(--background));
          border-bottom: 2px solid hsl(var(--border));
        }
        .calendar-wrapper .fc-timegrid-event {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          margin: 2px !important;
        }
        .calendar-wrapper .fc-timegrid-event-harness {
          margin-right: 4px !important;
        }
        .calendar-wrapper .fc-event-main {
          padding: 0 !important;
        }
        .calendar-wrapper .fc-timegrid-col-frame {
          min-height: 120px;
        }
        .calendar-wrapper .fc-timegrid-slot {
          height: 120px !important;
        }
        .calendar-wrapper .fc-timegrid-axis-frame {
          justify-content: flex-start !important;
          padding-top: 8px;
        }
      `}</style>
    </div>
  );
}
