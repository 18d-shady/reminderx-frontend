import api from "./api"; // assuming you have axios instance

// Assign task (add owner)
export async function assignTask(particularId: number, profileId: number) {
  const response = await api.post(`/api/particulars/${particularId}/owners/`, {
    profile_id: profileId,
  });
  return response.data;
}

// Remove task (remove owner)
export async function removeTask(particularId: number, profileId: number) {
  const response = await api.delete(`/api/particulars/${particularId}/owners/`, {
    data: { profile_id: profileId }, // axios requires `data` for DELETE
  });
  return response.data;
}

;

export async function sendMessage(profileId: number, channel: "sms" | "whatsapp", message: string) {
  const res = await api.post(`/api/staff/${profileId}/send-message/`, {
    channel,
    message,
  });
  return res.data;
}

export async function updateOrganizationIcon(orgId: string, file: File) {
  const formData = new FormData();
  formData.append("icon", file);

  const response = await api.post(`/api/organizations/${orgId}/set-icon/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

