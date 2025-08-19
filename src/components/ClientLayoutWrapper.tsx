
"use client";

import { usePathname } from "next/navigation";

const ClientLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/reset-password" || pathname === "/privacy-policy";

  return (
    <div className={`flex flex-col flex-1 ${!isAuthPage ? "md:ms-64" : ""}`}>
      {children}
    </div>
  );
};

export default ClientLayoutWrapper;
