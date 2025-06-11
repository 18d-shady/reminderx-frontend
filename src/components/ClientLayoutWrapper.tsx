
"use client";

import { usePathname } from "next/navigation";

const ClientLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <div className={`flex flex-col flex-1 ${!isAuthPage ? "md:ms-64" : ""}`}>
      {children}
    </div>
  );
};

export default ClientLayoutWrapper;
