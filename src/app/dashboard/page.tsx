"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import DashboardDocuments from "@/components/DashboardDocument";
import DashboardTable from "@/components/DashboardTable";
import { useDocuments } from "@/lib/useDocuments";
import Loader from '@/components/Loader';

const Dashboard = () => {
  const router = useRouter();
  const { documents, loading } = useDocuments();

  // You can add authentication checks here, for example, if the user is logged in
  useEffect(() => {
    const token = getCookie('reminderx_access');
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const expiring = documents.filter(doc => doc.status === "expiring soon").length;
  const expired = documents.filter(doc => doc.status === "expired").length;
  const normal = documents.filter(doc => doc.status === "up to date").length;

  // New: count of documents expiring within 7 days
  const expiringWithin7 = documents.filter(doc => {
    const expiry = new Date(doc.expiry_date);
    const today = new Date();
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return doc.status === "expiring soon" && daysLeft <= 7 && daysLeft >= 0;
  }).length;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-full w-full font-mono">

      <div className="fixed top-28 md:top-32 left-0 w-full px-2 md:pl-72">
        <div className="overflow-x-auto xl:overflow-x-visible md:me-5">
          <div className="flex w-max xl:w-full space-x-5 xl:px-3 xl:justify-between">
            <DashboardDocuments type="total" count={documents.length} action={expired} />
            <DashboardDocuments type="expired" count={expiring} action={expiringWithin7} />
            <DashboardDocuments type="normal" count={normal} action={0} />
          </div>
        </div>
      </div>

      <div className="fixed top-68 md:top-80 left-0 w-full px-2 md:pl-72 h-[calc(100vh-20rem)] overflow-y-auto">
        <div className="overflow-x-auto xl:overflow-x-visible md:me-5 h-full">
          <div className="w-full xl:border border-gray-300 xl:shadow-md rounded-lg">
            <DashboardTable data={documents} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
