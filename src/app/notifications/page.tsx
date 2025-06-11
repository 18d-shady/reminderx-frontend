"use client";

import NotificationItem from "@/components/NotificationItem";
import { useState, useEffect } from "react";
import { fetchNotifications, Notification } from '@/lib/user';
import Loader from '@/components/Loader';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchNotifications();
      setNotifications(data);
      setLoading(false);
    }
    load();
  }, []);

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    
    notifications.forEach(notif => {
      const date = new Date(notif.created_at).toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notif);
    });

    return groups;
  };

  if (loading) return <Loader />;

  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <div className="p-4 overflow-x-hidden font-mono">
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <div className="w-full max-w-full flex flex-col space-y-6">
          {Object.entries(groupedNotifications).map(([date, notifs]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-600 ">{date}</h3>
              <div className="space-y-2">
                {notifs.map((notif) => (
                  <NotificationItem 
                    key={notif.id} 
                    title={notif.particular_title} 
                    message={notif.message} 
                    time={notif.created_at} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
