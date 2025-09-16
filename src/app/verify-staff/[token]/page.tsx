"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/lib/api";
import { getCookie } from "cookies-next";

export default function VerifyStaffPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const { token } = params; // ✅ this works in App Router

  useEffect(() => {
    const verifyStaff = async () => {
      const access = getCookie("reminderx_access");
      if (!access) {
        // Not logged in → save token and redirect to login
        localStorage.setItem("pendingStaffVerification", token);
        router.push(`/login?next=/verify-staff/${token}`);
        return;
      }

      try {
        await api.post("/api/verify-staff/", { token });
        alert("✅ Staff successfully verified!");
        router.push("/dashboard");
      } catch (err: any) {
        console.error("Verification failed:", err);
        alert(err.response?.data?.error || "Verification failed");
        router.push("/dashboard");
      }
    };

    verifyStaff();
  }, [token, router]);

  return <p>Verifying staff…</p>;
}
