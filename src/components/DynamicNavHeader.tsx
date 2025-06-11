'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface DynamicNavHeaderProps {
  user: string;

}

const DynamicNavHeader: React.FC<DynamicNavHeaderProps> = ({ user }) => {
  const pathname = usePathname();


  if (pathname.startsWith('/dashboard') || pathname === '/') {
    return (
        <div className="text-gray-800">
          <p className="text-sm font-bold md:hidden truncate">{user}</p>
          <p className="text-xs md:hidden truncate">Welcome Back</p>
          
          <h3 className="text-2xl font-semibold hidden md:block">Dashboard</h3>
          <p className="text-vvs hidden md:block truncate">Welcome back! Monitor your upcoming document expirations.</p>
        </div>
      );
  }

  if (pathname.startsWith('/calendar')) {
    return (
        <div className="text-gray-800">
          <p className="text-lg font-semibold md:hidden truncate">DOC CALENDAR</p>
          
          <h3 className="text-2xl font-semibold hidden md:block">Document Calendar</h3>
          <p className="text-vvs hidden md:block truncate">Welcome back! Monitor your upcoming document expirations.</p>
        </div>
      );
  }

  if (pathname.startsWith('/documents')) {
    return (
        <div className="text-gray-800">
          <p className="text-lg font-semibold md:hidden truncate">DOCUMENTS</p>
          
          <h3 className="text-2xl font-semibold hidden md:block">Documents</h3>
          <p className="text-vvs hidden md:block truncate">Welcome back! Monitor your upcoming document expirations.</p>
        </div>
      );
  }

  if (pathname.startsWith('/notifications')) {
    return (
        <div className="text-gray-800">
          <p className="text-lg font-semibold md:hidden truncate">NOTIFICATIONS</p>
          
          <h3 className="text-2xl font-semibold hidden md:block">Notifications</h3>
          <p className="text-vvs hidden md:block truncate">Welcome back! Monitor your upcoming document expirations.</p>
        </div>
      );
  }

  if (pathname.startsWith('/settings')) {
    return (
        <div className="text-gray-800">
          <p className="text-lg font-semibold md:hidden truncate">ALL SETTINGS</p>
          
          <h3 className="text-2xl font-semibold hidden md:block">All Settings</h3>
          <p className="text-vvs hidden md:block truncate">Welcome back! Monitor your upcoming document expirations.</p>
        </div>
      );
  }
  

  return (
    <div className="text-gray-800">
        <p className="text-sm font-bold md:hidden truncate">{user}</p>
        <p className="text-xs md:hidden truncate">Welcome Back</p>

        <h3 className="text-2xl font-semibold hidden md:block">Documents</h3>
        <p className="text-vvs hidden md:block truncate">Welcome back! Monitor your upcoming document expirations.</p>
    </div>
  );
};

export default DynamicNavHeader;
