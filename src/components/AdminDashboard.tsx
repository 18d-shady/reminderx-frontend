"use client";

import { useState } from "react";
import { Staff } from "@/lib/useOrganization";

const AdminDashboardTable = ({ staff }: { staff: Staff[] }) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === staff.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(staff.map((s) => s.id));
    }
  };

  return (
    <div className="w-full p-3 md:p-5">
      <h2 className="text-lg font-bold mb-4">Admin Dashboard – Organization Staff</h2>
      <table className="w-full min-w-[800px] border border-gray-200 rounded-md shadow-sm text-left text-gray-700">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={selectedRows.length === staff.length && staff.length > 0}
                onChange={toggleAll}
              />
            </th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Joined</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.length > 0 ? (
            staff.map((user) => (
              <tr key={user.id} className="border-b border-gray-200">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => toggleRow(user.id)}
                  />
                </td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">{new Date(user.joined_at).toLocaleDateString()}</td>
                <td className="p-3 text-xs space-x-3">
                  <button className="text-blue-600 hover:underline">VIEW</button>
                  <button className="text-red-600 hover:underline">REMOVE</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No staff members found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboardTable;
