// components/NavbarWrapper.tsx (Client Component - Marked with `"use client"`)
"use client"; // This tells Next.js to treat this component as a client component

import { usePathname } from "next/navigation";
import Navbar from "@/components/NavBar"; // Import your Navbar component

const NavbarWrapper = () => {
  const pathname = usePathname(); // This is a client-side hook

  // Only show the Navbar if the user is on non-login/signup pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {/* Render the Navbar only if not on the login/signup pages */}
      {!isAuthPage && <Navbar />}
    </>
  );
};

export default NavbarWrapper;
