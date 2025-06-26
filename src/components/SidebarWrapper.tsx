"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/SideBar";

const SidebarWrapper = () => {
  const pathname = usePathname();

  // Only show the Navbar if the user is on non-login/signup pages
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/reset-password";

  return (
    <>
        {!isAuthPage && 
            <aside className="hidden md:flex md:w-64 bg-black text-white fixed h-screen z-50">
                <Sidebar />
            </aside>
        }
      
    </>
  );
};

export default SidebarWrapper;
