import { useEffect, useState } from "react";
import api from "@/lib/api";

export type Staff = {
  id: number;
  username: string;
  email: string;
  role: string;
  joined_at: string;
};

export type Organization = {
  id: number;
  name: string;
  staff: Staff[];
};

export const useOrganization = (organizationId: string) => {
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    if (!organizationId) return;

    const fetchOrganization = async () => {
      try {
        const res = await api.get<Organization>(
          `/api/organizations/${organizationId}/`
        );
        setOrganization(res.data);
      } catch (err) {
        console.error("Failed to fetch organization", err);
      }
    };

    fetchOrganization();
  }, [organizationId]);

  return { organization };
};
