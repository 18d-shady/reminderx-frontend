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

  if (loading) return <Loader />;

  return (
    <div className="p-4 overflow-x-hidden font-mono">
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <div className=" w-full max-w-full flex flex-col space-y-2">
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} title={notif.particular_title} message={notif.message} time={notif.created_at} />
          ))}
        </div>
      )}
      
    </div>
  );
};

export default NotificationPage;
