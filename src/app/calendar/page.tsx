"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './calendar.css'; // ← Custom styling overrides
import { fetchParticulars, Particular } from "@/lib/user";

const CalendarPage = () => {
  const [particulars, setParticulars] = useState<Particular[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadParticulars = async () => {
      const data = await fetchParticulars();
      console.log(data)
      setParticulars(data);
    };
    loadParticulars();
  }, []);

  const getEventsForDate = (date: Date) => {
    return particulars.filter(p => new Date(p.expiry_date).toDateString() === date.toDateString());
  };

  return (
    <div className="p-6 w-full max-w-full overflow-x-hidden font-mono">
      <div className="fixed bottom-10 right-10">
        <button
            onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
            className="p-4 text-white bgg-main rounded-full shadow-lg transition duration-200"
        >
            {viewMode === 'calendar' ? (
            // Toggle is ON (Calendar View)
            <svg className="h-7 w-7"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />  
              <line x1="8" y1="12" x2="21" y2="12" />  
              <line x1="8" y1="18" x2="21" y2="18" />  
              <line x1="3" y1="6" x2="3.01" y2="6" />  
              <line x1="3" y1="12" x2="3.01" y2="12" />  
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            
            ) : (
            // Toggle is OFF (List View)
            <svg className="h-7 w-7"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  
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
            return (
              dayEvents.length > 0 && (
                <div className="text-xs text-center text-white bg-red-700 mt-1 py-2 rounded-lg">
                  {dayEvents.length} due{dayEvents.length > 1 ? 's' : ''}
                </div>
              )
            );
          }}
        />
      ) : (
        <div>
          {particulars.map((event, i) => (
            <div key={i} className="border-b py-2">
              <strong>{new Date(event.expiry_date).toDateString()}</strong>: {event.title}
            </div>
          ))}
        </div>
      )}

      {selectedDate && viewMode === 'calendar' && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Reminders for {selectedDate.toDateString()}</h3>
          <ul className="list-disc ml-6">
            {getEventsForDate(selectedDate).map((event, idx) => (
              <li key={idx}>{event.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
