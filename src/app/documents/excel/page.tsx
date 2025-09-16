"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import api from "@/lib/api";
import { useDropzone } from "react-dropzone";
import Modal from "@/components/Modal";

// ✅ Define the valid schema from CreateDocumentForm
const REQUIRED_FIELDS = ["title", "category", "expiry_date",  "scheduled_date", "reminder_methods"];
const OPTIONAL_FIELDS = ["notes", "recurrence", "start_days_before"];

export default function ExcelUploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);


 const normalizeKey = (key: string) =>
    key.trim().toLowerCase().replace(/\s+/g, "_"); 
    // "Expiry Date" -> "expiry_date"

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;
      setFileName(file.name);

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(sheet);

      // ✅ Normalize keys
      const normalized = parsed.map((row: any) => {
        const newRow: any = {};
        Object.keys(row).forEach((key) => {
          newRow[normalizeKey(key)] = row[key];
        });
        return newRow;
      });

      // ✅ Validate schema
      const validRows: any[] = [];
      normalized.map((row: any, idx) => {
        const keys = Object.keys(row);

        // 1. Check for extra fields
        const extra = keys.filter(
          (k) => !REQUIRED_FIELDS.includes(k) && !OPTIONAL_FIELDS.includes(k)
        );
        if (extra.length > 0) {
          throw new Error(
            `Row ${idx + 1} contains invalid fields: ${extra.join(", ")}`
          );
        }

        // 2. Check required
        for (const field of REQUIRED_FIELDS) {
          if (!row[field]) {
            throw new Error(`Row ${idx + 1} missing required field: ${field}`);
          }
        }

        validRows.push(row);
      });

      setRows(validRows);
      setError(null);

    } catch (err: any) {
      console.error("❌ Validation error:", err.message);
      setRows([]); // clear invalid rows
      setError(err.message); // show error on UI
    }
  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
  });

  const handleBulkSubmit = async () => {
    try {
      const payload = {
        documents: rows.map((row) => ({
          title: row.title,
          category: row.category,
          expiry_date: row.expiry_date,
          notes: row.notes,
          reminders: [
            {
              scheduled_date: new Date(row.scheduled_date).toISOString(),
              reminder_methods: row.reminder_methods.split(','),
              recurrence: row.recurrence,
              start_days_before: row.start_days_before,
            }
          ],
        })),
      };

      await api.post("/api/bulk-create/", payload);

      setModalTitle("Success");
      setModalContent("✅ Documents and reminders created successfully!");
      setModalOpen(true);
      setRows([]);
      setFileName(null);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setModalTitle("Error");
      setModalContent(`❌ Failed to create documents with reminders: ${err.response?.data?.detail || err.message}`);
      setModalOpen(true);
    }
  };


  return (
    <div className="h-full w-full font-mono">
      {/* ✅ Header (fixed like dashboard cards) */}
      <div className="fixed top-28 md:top-32 left-0 w-full px-2 md:pl-72">
        <h2 className="text-xl lg:text-2xl font-semibold mb-4">
          Upload Excel/CSV for Bulk Reminders
        </h2>
      </div>

      {/* ✅ Scrollable content area */}
      <div
        className="fixed top-40 md:top-44 left-0 w-full px-2 md:pl-72 
        h-[calc(100vh-14rem)] overflow-y-auto"
      >
        <div className="p-3 md:p-6 mx-auto shadow rounded-lg w-full">
          {/* Instructions */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              Required Format:
            </h3>
            <div className="overflow-x-auto rounded-lg shadow-sm">
              <table className="min-w-[800px] w-full text-sm border-collapse border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                  <tr>
                    <th className="border border-gray-200 px-3 py-2 text-left">title*</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">category*</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">expiry_date*</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">notes</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">scheduled_date*</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">reminder_methods*</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">recurrence*</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">start_days_before</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">Passport</td>
                    <td className="border border-gray-200 px-3 py-2">personal</td>
                    <td className="border border-gray-200 px-3 py-2">2026-01-01</td>
                    <td className="border border-gray-200 px-3 py-2">Renew</td>
                    <td className="border border-gray-200 px-3 py-2">2025-12-20 10:00</td>
                    <td className="border border-gray-200 px-3 py-2">email,sms</td>
                    <td className="border border-gray-200 px-3 py-2">none</td>
                    <td className="border border-gray-200 px-3 py-2">7</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Columns marked with <span className="font-semibold">*</span> are
              required.
            </p>
          </div>

          {/* Drag & Drop Zone */}
          <div
            {...getRootProps()}
            className={`mt-6 border-2 border-dashed p-6 rounded-md text-center cursor-pointer min-h-[180px] flex items-center justify-center ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="font-semibold lg:text-lg text-gray-700">
                Drop the file here...
              </p>
            ) : (
              <p className="font-semibold lg:text-lg text-gray-700">
                Drag & drop an Excel/CSV file here, or{" "}
                <span className="text-blue-600">browse</span>
              </p>
            )}
          </div>

          {fileName && <p className="mt-2">Uploaded: {fileName}</p>}
          {error && <p className="text-red-600 mt-2">{error}</p>}

          {rows.length > 0 && (
            <div className="mt-4">
              <p className="mb-2">Preview ({rows.length} rows):</p>
              <pre className="bg-gray-100 p-2 rounded-md max-h-64 overflow-auto text-sm">
                {JSON.stringify(rows.slice(0, 5), null, 2)}
              </pre>
            </div>
          )}

          <button
            onClick={handleBulkSubmit}
            disabled={rows.length === 0}
            className="mt-6 px-4 py-2 bgg-main text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Create Documents & Reminders
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        footer={
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bgg-main text-black rounded hover:bg-blue-700"
          >
            Close
          </button>
        }
      >
        <div>{modalContent}</div>
      </Modal>
    </div>
  );


}
