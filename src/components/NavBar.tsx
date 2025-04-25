"use client"; // This tells Next.js to treat this component as a client component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth"; // Import the logout function from auth.ts

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle redirect to pages
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // This calls the logout function from auth.ts to clear tokens
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="w-full fixed top-0 z-10 bg-white shadow-md">
      {/* Desktop navbar */}
      <div className="hidden lg:flex justify-between items-center p-4">
        <div className="flex gap-8">
          <button onClick={() => handleNavigation("/dashboard")}>Dashboard</button>
          <button onClick={() => handleNavigation("/calendar")}>Calendar</button>
          <button onClick={() => handleNavigation("/documents")}>Documents</button>
        </div>
        <div className="flex gap-4">
          <button onClick={() => handleNavigation("/notifications")}>Notifications</button>
          <button onClick={() => handleNavigation("/settings")}>Settings</button>
          {/* Logout button */}
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
            Log Out
          </button>
        </div>
      </div>

      {/* Mobile navbar */}
      <div className="lg:hidden p-4 flex justify-between items-center">
        <button onClick={toggleMobileMenu} className="text-xl">
          ☰
        </button>

        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white p-4 shadow-md">
            <button onClick={() => handleNavigation("/dashboard")}>Dashboard</button>
            <button onClick={() => handleNavigation("/calendar")}>Calendar</button>
            <button onClick={() => handleNavigation("/documents")}>Documents</button>
            <button onClick={() => handleNavigation("/notifications")}>Notifications</button>
            <button onClick={() => handleNavigation("/settings")}>Settings</button>
            {/* Logout button for mobile */}
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
