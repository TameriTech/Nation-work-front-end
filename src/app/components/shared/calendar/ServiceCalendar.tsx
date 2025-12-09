"use client";
import { useRef, useState } from "react";

import { CalendarHeader } from "./CalendarHeader";
import {
  CalendarEventCard,
  CalendarEvent,
  EventStatus,
} from "./CalendarEventCard";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventContentArg } from "@fullcalendar/core";

// Sample event data
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Nom du service",
    start: new Date(2025, 8, 22, 9, 0),
    end: new Date(2025, 8, 22, 10, 0),
    price: 5000,
    status: "completed",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    title: "Nom du service",
    start: new Date(2025, 8, 22, 11, 0),
    end: new Date(2025, 8, 22, 12, 0),
    price: 7800,
    status: "published",
  },
  {
    id: "3",
    title: "Nom du service",
    start: new Date(2025, 8, 22, 12, 0),
    end: new Date(2025, 8, 22, 13, 0),
    price: 17000,
    status: "assigned",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    title: "Nom du service",
    start: new Date(2025, 8, 24, 9, 0),
    end: new Date(2025, 8, 24, 10, 0),
    price: 300,
    status: "completed",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    title: "Nom du service",
    start: new Date(2025, 8, 24, 10, 0),
    end: new Date(2025, 8, 24, 11, 0),
    price: 7800,
    status: "published",
  },
  {
    id: "6",
    title: "Nom du service",
    start: new Date(2025, 8, 24, 12, 0),
    end: new Date(2025, 8, 24, 13, 0),
    price: 6900,
    status: "published",
  },
  {
    id: "7",
    title: "Nom du service",
    start: new Date(2025, 8, 27, 9, 0),
    end: new Date(2025, 8, 27, 10, 0),
    price: 36000,
    status: "upcoming",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
  },
  {
    id: "8",
    title: "Nom du service",
    start: new Date(2025, 8, 27, 10, 0),
    end: new Date(2025, 8, 27, 11, 0),
    price: 17000,
    status: "upcoming",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
  },
  {
    id: "9",
    title: "Nom du service",
    start: new Date(2025, 8, 28, 12, 0),
    end: new Date(2025, 8, 28, 13, 0),
    price: 5000,
    status: "completed",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
];

const frenchDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export function ServiceCalendar() {
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
    const event = sampleEvents.find((e) => e.id === eventInfo.event.id);
    if (!event) return null;

    return <CalendarEventCard event={event} />;
  };

  const calendarEvents = sampleEvents.map((event) => ({
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
                  isToday
                    ? "font-bold text-foreground"
                    : "text-muted-foreground"
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
          color: hsl(var(--muted-foreground));
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
