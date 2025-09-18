"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { getFileTypeIcon } from "@/lib/getFileIcon";
import { updateParticular, deleteParticular } from "@/lib/user";

type TaskData = {
  id: number;
  document: string;
  category: string;
  expiry_date: string;
  completed: boolean; // use your model field
  picture: string;
};

const categoryColors: { [key: string]: string } = {
  vehicle: "bg-blue-300",
  travels: "bg-yellow-300",
  personal: "bg-pink-300",
  work: "bg-purple-300",
  professional: "bg-green-300",
  household: "bg-teal-300",
  finance: "bg-orange-300",
  health: "bg-red-300",
  social: "bg-indigo-300",
  education: "bg-gray-300",
  other: "bg-gray-200",
};

const TABS = ["All Tasks", "Completed", "Pending"];

const AnalyticsDashboardTable = ({ data }: { data: TaskData[] }) => {
  const [selectedTab, setSelectedTab] = useState("All Tasks");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const filteredData =
    selectedTab === "All Tasks"
      ? data
      : data.filter((item) =>
          selectedTab === "Completed" ? item.completed : !item.completed
        );

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((item) => item.id));
    }
  };

  // ✅ use existing function
  const markAsCompleted = async () => {
    try {
      await Promise.all(
        selectedRows.map(async (id) => {
          const formData = new FormData();
          formData.append("completed", "true");
          await updateParticular(id, formData); 
        })
      );
      setSelectedRows([]);
      // TODO: refresh data here
      window.location.reload();
    } catch (error) {
      console.error("Failed to mark as completed:", error);
    }
  };


  // ✅ use existing function
  const handleDelete = async () => {
    try {
      await Promise.all(selectedRows.map((id) => deleteParticular(id)));
      setSelectedRows([]);
      // TODO: trigger data refresh
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleExport = () => {
    const exportData = data.filter((item) => selectedRows.includes(item.id));

    if (exportData.length === 0) return;

    const worksheetData = exportData.map((item) => ({
      Document: item.document,
      Category: item.category,
      Expiry_Date: item.expiry_date,
      Completed: item.completed ? "Yes" : "No",
      Picture: item.picture,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reminders");

    XLSX.writeFile(workbook, "reminders.xlsx");
  };

  return (
    <div className="w-full p-3 md:p-5">
      <div className="flex items-center justify-between mb-5">
        {/* Tabs */}
        <div className="flex flex-row space-x-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 rounded-lg border border-gray-200 ${
                selectedTab === tab ? "bgg-main bgg-hover" : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 text-sm text-white rounded hover:bg-green-600 flex flex-row items-center space-x-2"
            >
              Export ({selectedRows.length})
            </button>
            <button
              onClick={markAsCompleted}
              className="px-4 py-2 bgg-main text-sm text-white rounded bgg-hover flex flex-row items-center space-x-2"
            >
              Completed ({selectedRows.length})
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-sm text-white rounded hover:bg-red-600 flex flex-row items-center space-x-2"
            >
              Delete ({selectedRows.length})
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <table className="w-full min-w-[800px] border border-gray-200 rounded-md shadow-sm text-left text-gray-700">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={
                  selectedRows.length === filteredData.length &&
                  filteredData.length > 0
                }
                onChange={toggleAllRows}
              />
            </th>
            <th className="p-3">Document</th>
            <th className="p-3">Category</th>
            <th className="p-3">Expiry Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => toggleRow(item.id)}
                  />
                </td>
                <td className="p-3 flex flex-row items-center space-x-5">
                  <div className="w-9 h-9 rounded overflow-hidden flex items-center justify-center">
                    {item.picture ? (
                      (() => {
                        const type = getFileTypeIcon(item.picture);
                        if (type === "image") {
                          return (
                            <img
                              src={item.picture}
                              alt={item.document}
                              className="w-full h-full object-contain"
                            />
                          );
                        } else {
                          return (
                            <a
                              href={item.picture}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="fff-main text-vvs"
                            >
                              {type.toUpperCase()}
                            </a>
                          );
                        }
                      })()
                    ) : (
                      <div className="w-full h-full bgg-main opacity-75 p-2 rounded-md">
                        File
                      </div>
                    )}
                  </div>
                  <span className="truncate">{item.document}</span>
                </td>
                <td className="p-3">
                  <span
                    className={`capitalize px-2 py-1 rounded text-sm font-medium ${
                      categoryColors[item.category] || "bg-gray-200"
                    }`}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="p-3">{item.expiry_date}</td>
                <td className="p-3">
                  <span
                    className={`capitalize px-2 py-1 rounded text-sm font-medium ${
                      item.completed ? "bg-green-300" : "bg-red-300"
                    }`}
                  >
                    {item.completed ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="p-3 text-xs">
                  <Link href={`/documents/${item.id}`} className="fff-main">
                    VIEW
                  </Link>
                  <Link
                    href={`/documents/${item.id}/edit`}
                    className="text-gray-800 ms-5"
                  >
                    EDIT
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No Tasks
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsDashboardTable;
