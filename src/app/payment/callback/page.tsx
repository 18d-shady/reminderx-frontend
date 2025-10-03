"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getCookie } from "cookies-next";

export default function PaymentCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      setLoading(true);
      setResult(null);

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get("reference");

        if (!reference) {
          setResult("❌ No transaction reference found.");
          setLoading(false);
          return;
        }

        const access = getCookie("reminderx_access");
        if (!access) {
          // Not logged in → save reference and redirect to login
          localStorage.setItem("pendingPaymentReference", reference);
          router.push(`/login?next=/payment/callback?reference=${reference}`);
          return;
        }

        // ✅ Call backend verify endpoint
        const response = await api.get(`/api/paystack/verify/${reference}/`);

        if (response.data?.status === "success") {
          setResult(
            `✅ Payment verified! Your plan: ${response.data.plan}. Expiry: ${new Date(
              response.data.new_expiry
            ).toLocaleDateString()}`
          );

          // Refresh state / redirect
          setTimeout(() => {
            router.push("/settings");
          }, 3000);
        } else {
          setResult("❌ Payment verification failed.");
        }
      } catch (err: any) {
        console.error(err);
        setResult(
          `❌ Error: ${err.response?.data?.error || err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
      {loading && <p className="text-gray-500 animate-pulse">Verifying...</p>}
      {!loading && result && (
        <p
          className={
            result.startsWith("✅")
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {result}
        </p>
      )}
    </div>
  );
}
