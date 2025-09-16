"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/lib/api";
import { getCookie } from "cookies-next";

interface VerifyStaffPageProps {
  params: {
    token: string;
  };
}

export default function VerifyStaffPage({ params }: VerifyStaffPageProps) {
  const router = useRouter();
  
  useEffect(() => {
    const verifyStaff = async () => {
      // Await params since they might be a Promise in some Next.js versions
      const resolvedParams = await Promise.resolve(params);
      const { token } = resolvedParams;
      
      const access = getCookie("reminderx_access");
      if (!access) {
        // Not logged in → save token and redirect to login
        localStorage.setItem("pendingStaffVerification", token);
        router.push(`/login?next=/verify-staff/${token}`);
        return;
      }

      try {
        await api.post("/api/verify-staff/", { token });
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