"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import DashboardDocuments from "@/components/DashboardDocument";
import DashboardTable from "@/components/DashboardTable";
import { useDocuments } from "@/lib/useDocuments";
import Loader from '@/components/Loader';
import { useSubscription } from "@/lib/useSubscription";
import AnalyticsDashboardTable from "@/components/AnalyticsDashboardTable";
import { useOrganization } from "@/lib/useOrganization";
import { fetchCurrentUser } from "@/lib/user";
import type CurrentUser from "@/lib/user";
import AdminDashboard from "@/components/AdminDashboard";

const Dashboard = () => {
  const router = useRouter();
  const { documents, loading } = useDocuments();
  const { plan } = useSubscription();

  const [user, setUser] = useState<CurrentUser | null>(null)

  // You can add authentication checks here, for example, if the user is logged in
  useEffect(() => {
    const token = getCookie('reminderx_access');
    if (!token) {
      router.push("/login");
    } else {
      fetchCurrentUser().then(setUser);
    }
  }, [router]);

  const orgId =
    user?.organization && user.role === "admin"
      ? user.organization.organizational_id.toString()
      : null;

  const { organization } = useOrganization(orgId ?? "");

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

  return (
    <>
      <Loader isOpen={loading} />
      <div className="h-full w-full font-mono">

        <div className="fixed top-28 md:top-32 left-0 w-full px-2 md:pl-72">
          <div className="overflow-x-auto xl:overflow-x-visible md:me-5">
            <div className="flex w-max xl:w-full space-x-5 px-3 xl:px-3 xl:justify-between">
              <DashboardDocuments type="total" count={documents.length} action={expired} />
              <DashboardDocuments type="expired" count={expiring} action={expiringWithin7} />
              <DashboardDocuments type="normal" count={normal} action={0} />
            </div>
          </div>
        </div>

        <div className="fixed top-68 md:top-80 left-0 w-full px-2 md:pl-72 h-[calc(100vh-18rem)] 
          md:h-[calc(100vh-20rem)] overflow-y-auto">
          <div className="overflow-x-auto xl:overflow-x-visible md:me-5 h-full">
            <div className="w-full xl:border border-gray-300 xl:shadow-md rounded-lg">

              {/* 
              {plan == 'enterprise' || plan == 'multiusers' ? (
                <AnalyticsDashboardTable data={documents} />
              ) : (
                <DashboardTable data={documents} />
              )}
              */}

              {user && (
                <>
                  {plan === "enterprise" ? (
                    <AnalyticsDashboardTable data={documents} />
                  ) : plan === "multiusers" && user.role !== "admin" ? (
                    <AnalyticsDashboardTable data={documents} />
                  ) : plan === "multiusers" && user.role === "admin" ? (
                    <div className="space-y-6">
                      <AdminDashboard staff={organization?.staff ?? []} />
                      <AnalyticsDashboardTable data={documents} />
                    </div>
                  ) : (
                    <DashboardTable data={documents} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
