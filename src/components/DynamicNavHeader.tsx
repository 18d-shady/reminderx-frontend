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
          <p className="text-sm font-bold md:hidden">{user}</p>
          <p className="text-xs md:hidden">Welcome Back</p>
          
          <h3 className="text-2xl font-semibold hidden md:block">Dashboard</h3>
          <p className="text-vvs hidden md:block">Welcome back! Monitor your upcoming document expirations.</p>
        </div>
      );
  }

  if (pathname.startsWith('/calendar')) {
    return (
        <div className="text-gray-800">
          <p className="text-lg font-semibold md:hidden">DOC CALENDAR</p>
          
          <h3 className="text-2xl font-semibold hidden md:block">Document Calendar</h3>
          <p className="text-vvs hidden md:block">Welcome back! Monitor your upcoming document expirations.</p>
        </div>
      );
  }

  if (pathname.startsWith('/documents')) {
    return (
        <div className="text-gray-800">
          <p className="text-lg font-semibold md:hidden">DOCUMENTS</p>
          
          <h3 className="text-2xl font-semibold hidden md:block">Documents</h3>
          <p className="text-vvs hidden md:block">Welcome back! Monitor your upcoming document expirations.</p>
        </div>
      );
  }

  if (pathname.startsWith('/notifications')) {
    return (
        <div className="text-gray-800">
          <p className="text-lg font-semibold md:hidden">NOTIFICATIONS</p>
          
          <h3 className="text-2xl font-semibold hidden md:block">Notifications</h3>
          <p className="text-vvs hidden md:block">Welcome back! Monitor your upcoming document expirations.</p>
        </div>
      );
  }

  if (pathname.startsWith('/settings')) {
    return (
        <div className="text-gray-800">
          <p className="text-lg font-semibold md:hidden">ALL SETTINGS</p>
          
          <h3 className="text-2xl font-semibold hidden md:block">All Settings</h3>
          <p className="text-vvs hidden md:block">Welcome back! Monitor your upcoming document expirations.</p>
        </div>
      );
  }
  

  return (
    <div className="text-gray-800">
        <p className="text-sm font-bold md:hidden">{user}</p>
        <p className="text-xs md:hidden">Welcome Back</p>

        <h3 className="text-2xl font-semibold hidden md:block">Documents</h3>
        <p className="text-vvs hidden md:block">Welcome back! Monitor your upcoming document expirations.</p>
    </div>
  );
};

export default DynamicNavHeader;
