"use client"; // This page needs client-side rendering (optional but helpful)

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  // You can add authentication checks here, for example, if the user is logged in
  useEffect(() => {
    const isAuthenticated = true; // Replace with actual authentication check
    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [router]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
      <div className="mt-4">
        <p>This is your personalized dashboard.</p>
        <p>You can add widgets, stats, and more here.</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <ul className="space-y-4">
          <li>Activity 1: Lorem ipsum dolor sit amet</li>
          <li>Activity 2: Consectetur adipiscing elit</li>
          <li>Activity 3: Integer nec odio. Praesent libero.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
