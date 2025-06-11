"use client";

import React, { useState } from "react";
import DocumentItem from "@/components/DocumentItem";
import DashboardTable from "@/components/DashboardTable";
import { useDocuments } from "@/lib/useDocuments";

const TABS = ["All", "Expiring Soon", "Up to Date"];

const DocumentPage = () => {
  const { documents, loading } = useDocuments();
  const [selectedTab, setSelectedTab] = useState("All");

  const filteredDocuments =
    selectedTab === "All"
      ? documents
      : documents.filter((doc) => doc.status === selectedTab.toLowerCase());

  if (loading) return <div className="p-4 font-mono">Loading documents...</div>;

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden font-mono">
      {/* Mobile Tabs */}
      <div className="flex flex-row space-x-3 mb-5 lg:hidden">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-full border text-vvs ${
              selectedTab === tab ? "bgg-main text-white" : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Mobile View */}
      <div className="w-full flex flex-col space-y-4 lg:hidden ">
        {filteredDocuments.map((doc) => (
          <DocumentItem
            key={doc.id}
            id={doc.id}
            name={doc.document}
            expiry_date={new Date(doc.expiry_date)}
            status={doc.status}
            picture={doc.picture}
          />
        ))}
      </div>

      {/* Desktop Table View 
      <div className="w-full">
        <DashboardTable data={documents} />
      </div>
      */}
      <div className="hidden lg:flex fixed top-28 left-0 w-full px-2 md:pl-68 h-[calc(100vh-7rem)] overflow-y-auto">
        <div className="overflow-x-auto xl:overflow-x-visible me-5 h-full">
          <div className="w-full">
            <DashboardTable data={documents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
