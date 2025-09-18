// hooks/useDocuments.ts
import { useEffect, useState } from "react";
import api from "@/lib/api";
import dayjs from "dayjs";

type BackendParticular = {
  id: number;
  title: string;
  category: string;
  expiry_date: string;
  document_url: string;
  completed: boolean;
};

type UIData = {
  id: number;
  document: string;
  category: string;
  expiry_date: string;
  status: string;
  picture: string;
  completed: boolean;
};

const computeStatus = (expiryDate: string): string => {
  const today = dayjs();
  const expiry = dayjs(expiryDate);
  const daysLeft = expiry.diff(today, "day");
  
  if (daysLeft < 0) {
    return "expired";
  } else if (daysLeft <= 30) {
    return "expiring soon";
  } else {
    return "up to date";
  }
};

export const useDocuments = () => {
  const [documents, setDocuments] = useState<UIData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get<BackendParticular[]>("/api/particulars/");
        const mapped = response.data.map((doc) => ({
          id: doc.id,
          document: doc.title,
          category: doc.category,
          expiry_date: dayjs(doc.expiry_date).format("MM/DD/YYYY"),
          status: computeStatus(doc.expiry_date),
          picture: doc.document_url,
          completed: doc.completed
        }));
        setDocuments(mapped);
      } catch (err) {
        console.error("Failed to fetch documents", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return { documents, loading };
};
