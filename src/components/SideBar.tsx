'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from "@/lib/auth"; // Import the logout function from auth.ts
import Image from "next/image";
import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '@/lib/user';
import type CurrentUser from "@/lib/user";

const Sidebar = () => {
  const pathname = usePathname();

  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchCurrentUser();
      setUser(data);
    };
    loadUser();
  }, []);

  return (
    <nav className="flex flex-col justify-between h-screen font-mono w-full">

      <div className="flex flex-col space-y-3 text-sm">
        <div className="flex items-center text-white text-xl m-4 space-x-2 ">
          <div className="w-9 h-9 overflow-hidden rounded-md relative">
            <Image 
              alt="naikas"
              src="/images/naikas_icon.png"
              fill
              style={{ 
                objectFit: 'cover', 
                objectPosition: 'center' 
              }}
            />
          </div>
          <h1 className="">NAIKAS</h1>
        </div>

        <div className="flex items-center bg-white text-gray-800 rounded-full space-x-2 overflow-hidden
          mx-4 mt-4 pe-5 max-w-[80%]">
          <div className="h-10 w-10 bg-gray-300 rounded-full relative overflow-hidden 
            cursor-pointer hover:opacity-80 transition-opacity">
              {user?.profile_picture_url ? (
                <Image alt="user" src={user.profile_picture_url} fill 
                  style={{ objectFit: 'cover', objectPosition: 'center' }} unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-2xl text-gray-600">
                    {user?.user.username?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>

          {user ? (
            <p className="text-sm"> {user.user.username}</p>
          ) : (
            <p className="text-sm">Loading...</p>
          )}
        </div>

        <div className={`px-4 py-2 w-[90%] flex flex-row space-x-2 items-center mt-4
          ${pathname === '/dashboard' ? 'bgg-main text-gray-900' : 'hover:text-gray-400 '}`}>

          <svg className="h-5 w-5"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <polyline points="5 12 3 12 12 3 21 12 19 12" /> 
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />  
            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
          </svg>

          <Link href="/dashboard">Dashboard</Link>
        </div>

        <div className={`px-4 py-2 w-[90%] flex flex-row space-x-2 item-center
          ${pathname === '/calendar' ? 'bgg-main text-gray-900' : 'hover:text-gray-400 '}`}>

          <svg className="h-5 w-5"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="4" y="5" width="16" height="16" rx="2" />  <line x1="16" y1="3" x2="16" y2="7" />  <line x1="8" y1="3" x2="8" y2="7" />  <line x1="4" y1="11" x2="20" y2="11" />  <line x1="11" y1="15" x2="12" y2="15" />  <line x1="12" y1="15" x2="12" y2="18" /></svg>

          <Link href="/calendar"> Calendar</Link>
        </div>

        <div className={`px-4 py-2 w-[90%] flex flex-row space-x-2 item-center
          ${pathname === '/documents' ? 'bgg-main text-gray-900' : 'hover:text-gray-400 '}`}>

          <svg className="h-5 w-5"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M14 3v4a1 1 0 0 0 1 1h4" />  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  <line x1="9" y1="9" x2="10" y2="9" />  <line x1="9" y1="13" x2="15" y2="13" />  <line x1="9" y1="17" x2="15" y2="17" /></svg>

          <Link href="/documents" > Documents </Link>
        </div>

        <div className={`px-4 py-2 w-[90%] flex flex-row space-x-2 item-center
          ${pathname === '/notifications' ? 'bgg-main text-gray-900' : 'hover:text-gray-400 '}`}>

          <svg className="h-5 w-5"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>


          <Link href="/notifications" > Notifications </Link>
        </div>

        <div className={`px-4 py-2 w-[90%] flex flex-row space-x-2 item-center
          ${pathname === '/settings' ? 'bgg-main text-gray-900' : 'hover:text-gray-400 '}`}>

          <svg className="h-5 w-5"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />  <circle cx="12" cy="12" r="3" />
          </svg>

          <Link href="/settings" > Settings </Link>
        </div>
      
      </div>

      <button onClick={handleLogout} className="text-white px-4 py-5 hover:text-gray-400 transition
       flex flex-row space-x-2 item-center ">
        <svg className="h-5 w-5"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
          <path d="M7 12h14l-3 -3m0 6l3 -3" />
        </svg>
        Log Out
      </button>
    </nav>
  );
};

export default Sidebar;
