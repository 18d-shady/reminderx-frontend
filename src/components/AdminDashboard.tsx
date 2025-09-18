"use client";

import { useState } from "react";
import { Staff } from "@/lib/useOrganization";
import { assignTask, removeTask, sendMessage } from "@/lib/organization";
import api from "@/lib/api";
import Modal from "./Modal";
import { useDocuments } from "@/lib/useDocuments";

const AdminDashboardTable = ({ staff }: { staff: Staff[] }) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [staffParticulars, setStaffParticulars] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Message modal state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"sms" | "whatsapp">(
    "sms"
  );

  // 🔹 Assign Task modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedParticularId, setSelectedParticularId] = useState<number | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);

  const { documents, loading: docsLoading } = useDocuments();

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

  const fetchStaffParticulars = async (profileId: number) => {
    try {
      const res = await api.get(`/api/staff/${profileId}/particulars/`);
      setStaffParticulars(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch staff particulars:", err);
    }
  };

  // 🔹 Unified send message (one or many)
  const handleSendMessage = async () => {
    if (selectedRows.length === 0) return;
    try {
      await Promise.all(
        selectedRows.map((id) =>
          sendMessage(id, selectedChannel, messageText)
        )
      );
      alert(
        `✅ ${selectedChannel.toUpperCase()} sent to ${selectedRows.length} staff`
      );
      setIsMessageModalOpen(false);
      setMessageText("");
      setSelectedRows([]);
    } catch (err) {
      console.error("Send message failed:", err);
      alert("❌ Failed to send message(s)");
    }
  };

  // 🔹 Unified assign task (one or many)
  const handleAssignTask = async () => {
    if (!selectedParticularId || selectedRows.length === 0) return;
    try {
      await Promise.all(
        selectedRows.map((profileId) =>
          assignTask(selectedParticularId, profileId)
        )
      );
      alert(`✅ Task assigned to ${selectedRows.length} staff`);
      setIsAssignModalOpen(false);
      setSelectedParticularId(null);
      setSelectedRows([]);
    } catch (error) {
      console.error("Assign task failed:", error);
      alert("❌ Failed to assign task");
    }
  };

  return (
    <div className="w-full p-3 md:p-5">
      <h2 className="text-lg font-bold mb-4">
        Admin Dashboard – Organization Staff
      </h2>

      {/* ✅ Bulk actions bar */}
      {selectedRows.length > 0 && (
        <div className="mb-3 flex space-x-4 text-sm float-right">
          <span className="font-medium">{selectedRows.length} selected</span>
          <button
            className="text-green-600 hover:underline"
            onClick={() => setIsMessageModalOpen(true)}
          >
            Send Message
          </button>
          <button
            className="text-indigo-600 hover:underline"
            onClick={() => setIsAssignModalOpen(true)}
          >
            Assign Task
          </button>
        </div>
      )}

      {/* ✅ Staff Table */}
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
                <td className="p-3">
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={user.role}
                    disabled={user.role === "admin"}
                    onChange={(e) => {
                      if (user.role === "admin") return;
                      console.log(
                        `Role for ${user.username} changed to`,
                        e.target.value
                      );
                    }}
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    {user.role === "admin" && (
                      <option value="admin">Admin</option>
                    )}
                  </select>
                </td>
                <td className="p-3">
                  {new Date(user.joined_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-xs space-x-3">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => fetchStaffParticulars(user.id)}
                  >
                    VIEW
                  </button>
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => {
                      setSelectedRows([user.id]); // ✅ reuse same modal
                      setIsMessageModalOpen(true);
                    }}
                  >
                    SEND MESSAGE
                  </button>
                  <button
                    className="text-indigo-600 hover:underline"
                    onClick={() => {
                      setSelectedRows([user.id]); // ✅ reuse same modal
                      setIsAssignModalOpen(true);
                    }}
                  >
                    ASSIGN TASK
                  </button>
                  <button
                    className={`hover:underline ${
                      user.role === "admin"
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600"
                    }`}
                    disabled={user.role === "admin"}
                    onClick={() => {
                      if (user.role !== "admin") {
                        setDeleteTarget(user); // store the staff being deleted
                        setIsDeleteModalOpen(true); // open modal
                      }
                    }}
                  >
                    DELETE
                  </button>

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

      {/* 🔹 VIEW Particulars Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Staff: ${staffParticulars?.staff.username}`}
      >
        <div>
          <h4 className="font-semibold mb-2">Created Particulars</h4>
          {staffParticulars?.created_particulars.length > 0 ? (
            staffParticulars.created_particulars.map((p: any) => (
              <div
                key={p.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>
                  {p.title} – {new Date(p.expiry_date).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No created particulars</p>
          )}

          <h4 className="font-semibold mt-4 mb-2">Owned Particulars</h4>
          {staffParticulars?.owned_particulars.length > 0 ? (
            staffParticulars.owned_particulars.map((p: any) => (
              <div
                key={p.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>
                  {p.title} – {new Date(p.expiry_date).toLocaleDateString()}
                </span>
                <button
                  className="text-red-600 hover:underline text-sm"
                  onClick={() => removeTask(p.id, staffParticulars.staff.id)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No owned particulars</p>
          )}
        </div>
      </Modal>

      {/* 🔹 Send Message Modal */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title={`Send Message (${selectedRows.length} recipient${
          selectedRows.length > 1 ? "s" : ""
        })`}
      >
        <div className="space-y-3">
          {/* Channel picker */}
          <div className="flex space-x-4">
            <button
              className={`px-3 py-1 rounded ${
                selectedChannel === "sms"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedChannel("sms")}
            >
              SMS
            </button>
            <button
              className={`px-3 py-1 rounded ${
                selectedChannel === "whatsapp"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedChannel("whatsapp")}
            >
              WhatsApp
            </button>
          </div>

          {/* Message text area */}
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
          />

          {/* Send button */}
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={handleSendMessage}
          >
            Send {selectedChannel.toUpperCase()}
          </button>
        </div>
      </Modal>

      {/* 🔹 Assign Task Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Task (${selectedRows.length} recipient${
          selectedRows.length > 1 ? "s" : ""
        })`}
      >
        <div className="space-y-3">
          {docsLoading ? (
            <p className="text-gray-500 text-sm">Loading tasks...</p>
          ) : documents.length > 0 ? (
            <select
              value={selectedParticularId ?? ""}
              onChange={(e) => setSelectedParticularId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="">Select a Task</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.document} ({doc.status})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500 text-sm">No tasks available</p>
          )}

          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={handleAssignTask}
            disabled={!selectedParticularId}
          >
            Assign Task
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <>
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={async () => {
                if (!deleteTarget) return;
                try {
                  await api.delete(`/api/staff/${deleteTarget.id}/delete/`);
                  alert(`✅ ${deleteTarget.username} deleted`);
                  setIsDeleteModalOpen(false);
                  setDeleteTarget(null);
                  // 🔄 Refresh staff list (you can replace with SWR/React Query refetch instead of reload)
                  window.location.reload();
                } catch (err) {
                  console.error("Delete failed:", err);
                  alert("❌ Failed to delete staff");
                }
              }}
            >
              Delete
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{deleteTarget?.username}</span>?  
          This action cannot be undone.
        </p>
      </Modal>

    </div>
  );
};

export default AdminDashboardTable;
