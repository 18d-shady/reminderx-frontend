"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import { fetchParticulars, Particular } from "@/lib/user";
import dayjs from "dayjs";
import { useSubscription } from "@/lib/useSubscription";
import { redirect } from "next/navigation";

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  type: 'expiry' | 'reminder';
  recurrence?: string;
}


const CalendarPage = () => {
  const [particulars, setParticulars] = useState<Particular[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { plan } = useSubscription();

  /*
  if (plan === 'free') {
    redirect('/'); // or maybe '/upgrade' page
  }
    */

  useEffect(() => {
    const loadParticulars = async () => {
      const data = await fetchParticulars();
      setParticulars(data);
      
      // Process events
      const processedEvents: CalendarEvent[] = [];
      
      data.forEach(particular => {
        // Add expiry date event
        processedEvents.push({
          id: particular.id,
          title: `${particular.title} (Expires)`,
          date: new Date(particular.expiry_date),
          type: 'expiry'
        });

        // Process reminders
        if (particular.reminders && particular.reminders.length > 0) {
          particular.reminders.forEach(reminder => {
            const expiryDate = new Date(particular.expiry_date);
            
            // Add the scheduled reminder
            processedEvents.push({
              id: reminder.id,
              title: `Reminder for ${particular.title}`,
              date: new Date(reminder.scheduled_date),
              type: 'reminder',
              recurrence: reminder.recurrence
            });

            // Add recurring reminders if applicable
            if (reminder.recurrence !== 'none') {
              // Calculate start date based on start_days_before
              let currentDate = dayjs(expiryDate).subtract(reminder.start_days_before, 'day');
              const endDate = dayjs(expiryDate);
              
              while (currentDate.isBefore(endDate)) {
                if (reminder.recurrence === 'daily') {
                  currentDate = currentDate.add(1, 'day');
                } else if (reminder.recurrence === 'every_2_days') {
                  currentDate = currentDate.add(2, 'days');
                }

                if (currentDate.isBefore(endDate)) {
                  processedEvents.push({
                    id: reminder.id,
                    title: `Reminder for ${particular.title}`,
                    date: currentDate.toDate(),
                    type: 'reminder',
                    recurrence: reminder.recurrence
                  });
                }
              }
            }
          });
        }
      });

      setEvents(processedEvents);
    };
    loadParticulars();
  }, []);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="p-6 w-full max-w-full overflow-x-hidden font-mono">
      <div className="fixed bottom-10 right-10">
        <button
          onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
          className="p-4 text-white bgg-main bgg-hover rounded-full shadow-lg transition duration-200"
        >
          {viewMode === 'calendar' ? (
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          ) : (
            <svg className="h-7 w-7" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z"/>
              <rect x="4" y="5" width="16" height="16" rx="2" />
              <line x1="16" y1="3" x2="16" y2="7" />
              <line x1="8" y1="3" x2="8" y2="7" />
              <line x1="4" y1="11" x2="20" y2="11" />
              <rect x="8" y="15" width="2" height="2" />
            </svg>
          )}
        </button>
      </div>

      {viewMode === 'calendar' ? (
        <Calendar
          onClickDay={(value) => setSelectedDate(value)}
          tileContent={({ date }) => {
            const dayEvents = getEventsForDate(date);
            if (dayEvents.length === 0) return null;

            return (
              <div className="flex flex-col gap-1 mt-1">
                <div className="text-xs text-center text-white bg-red-700 py-1 rounded-lg">
                  {dayEvents.length} due
                </div>
              </div>
            );
          }}
        />
      ) : (
        <div className="space-y-4">
          {events
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((event, i) => (
            <div key={i} className=" rounded-lg shadow p-4">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {event.date.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {event.recurrence && event.type === 'reminder' && (
                  <span className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded-full inline-block">
                    Recurrence: {event.recurrence}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDate && viewMode === 'calendar' && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Events for {selectedDate.toDateString()}</h3>
          <div className="space-y-2">
            {getEventsForDate(selectedDate).map((event, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-700"></div>
                <span>{event.title}</span>
                {event.recurrence && event.type === 'reminder' && (
                  <span className="text-xs text-gray-500">
                    ({event.recurrence})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
