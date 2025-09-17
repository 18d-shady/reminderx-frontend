"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/lib/api";
import { getCookie } from "cookies-next";

interface VerifyStaffPageProps {
  params: Promise<{ token: string }>;
}

export default function VerifyStaffPage({ params }: VerifyStaffPageProps) {
  const router = useRouter();
  
  
  useEffect(() => {
    const verifyStaff = async () => {
      
      const { token } = await params;
      const decodeToken = decodeURIComponent(token);
      const access = getCookie("reminderx_access");
      if (!access) {
        // Not logged in → save token and redirect to login
        localStorage.setItem("pendingStaffVerification", token);
        router.push(`/login?next=/verify-staff/${token}`);
        return;
      }

      try {
        await api.post("/api/verify-staff/", { token: decodeToken });
        alert("Staff successfully verified!");
        router.push("/dashboard");
      } catch (err: any) {
        console.error("Verification failed:", err);
        alert(err.response?.data?.error || "Verification failed");
        router.push("/dashboard");
      }
    };

    verifyStaff();
  }, [params, router]);

  return <p>Verifying staff…</p>;
}